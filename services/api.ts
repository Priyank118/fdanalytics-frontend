
import { MatchSummary, Team, User, PlayerStat, DashboardStats, Player, PlayerRole, UserProfile } from "../types";

// Helper to normalize the API URL
const getApiUrl = () => {
    // Safely access import.meta.env
    const env = (import.meta as any).env;
    let url = (env && env.VITE_API_URL) || "http://localhost:5000/api";
    
    // Normalize: Remove trailing slash if present
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    
    // Auto-fix: Append /api if missing (Common configuration error)
    if (!url.endsWith('/api')) {
        url = `${url}/api`;
    }
    
    return url;
};

const API_URL = getApiUrl();

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
  };
};

// --- HELPER: ANALYTICS ENGINE (Shared Logic) ---
const generatePlayerSpecificInsight = (stat: PlayerStat, role: PlayerRole, placement: number): string[] => {
    const tips: string[] = [];
    const [mm] = stat.survivalTime.split(':').map(Number);
    const survivalMinutes = mm || 0;
    const damagePerKill = stat.kills > 0 ? stat.damage / stat.kills : stat.damage;

    // --- 1. Survival vs Impact Analysis ---
    if (survivalMinutes > 22 && stat.damage < 250) {
        tips.push("⚠️ Passive Play Detected: High survival time (22m+) with low damage. You might be playing too safe or avoiding necessary team fights.");
    }
    if (survivalMinutes < 5 && stat.damage > 400) {
        tips.push("🔥 Glass Cannon: Massive early game damage but died too fast. Wait for your Support to trade you.");
    }

    // --- 2. Efficiency Analysis ---
    if (stat.assists >= 3 && stat.kills <= 1) {
        tips.push("💡 Setup Master: You're dealing damage but not securing kills. Communicate 'One HP' calls more clearly to teammates.");
    }
    if (stat.damage > 1000 && stat.kills < 3) {
        tips.push("⚠️ Kill Conversion Issue: 1000+ Damage but low kills. Work on spray transfers and finishing knocks.");
    }

    // --- 3. Role Based Analysis ---
    if (role === 'Fragger') {
        if (stat.kills < 3) tips.push("⚠️ Underperformance: Fragger target is 3+ kills. Review your entry pathing.");
        if (stat.damage > 800) tips.push("✅ Entry Fragger God: Excellent damage output, creating space for the team.");
    } 
    else if (role === 'Support') {
        if (stat.revives >= 2) tips.push("✅ Medic: 2+ Revives secured. You kept the squad alive in critical moments.");
        if (stat.assists > 2) tips.push("✅ Utility God: High assist count indicates great grenade/cover usage.");
        if (survivalMinutes < 12) tips.push("⚠️ Anchor Down: Support died too early. You need to be the last one alive to hold rotations.");
    }
    else if (role === 'IGL') {
        if (placement > 10 && survivalMinutes < 10) tips.push("⚠️ Leader Down: IGL died early. Prioritize your life to make mid-game calls.");
        if (placement <= 3) tips.push("✅ Macro Genius: Top 3 placement. Your rotations were on point.");
    }
    else if (role === 'Assaulter') {
         if (stat.kills < 2) tips.push("⚠️ Aim Duel Loss: Assaulter needs to win 1v1s. Hop into TDM to warm up.");
         if (stat.kills >= 5) tips.push("🔥 Terminator: 5+ Kills. You dominated the lobby.");
    }
    
    // Fallback
    if (tips.length === 0) {
        if(stat.kills > 2) tips.push("✅ Solid performance. Good contribution.");
        else tips.push("💡 Review replay: Identify one mistake in your last engagement.");
    }

    return tips;
};

const generateMatchInsights = (match: MatchSummary): string[] => {
  const insights = [];
  
  // Team Synergy Logic
  const teamRevives = match.players.reduce((acc, p) => acc + (p.revives || 0), 0);
  const totalAssists = match.players.reduce((acc, p) => acc + (p.assists || 0), 0);

  if (match.placement <= 3 && match.totalTeamKills < 4) {
    insights.push("🐍 Snake Strategy: High placement but very low kills. Good for points, bad for practice.");
  }
  if (match.placement > 10 && match.totalTeamDamage > 1500) {
    insights.push("💔 Unlucky Wipe: Team dealt massive damage (1.5k+) but wiped early. Third-partied?");
  }
  if (match.totalTeamKills > 12) {
    insights.push("🦁 Lobby Domination: 12+ Team Kills. Aggressive rotations paid off.");
  }
  if (teamRevives > 4) {
    insights.push(`🚑 Resilient Squad: ${teamRevives} total revives. Great resetting capability under pressure.`);
  }
  if (totalAssists > match.totalTeamKills) {
    insights.push("🤝 Teamwork Peak: More assists than kills implies excellent team-firing.");
  }

  return insights;
};

const generateGlobalInsights = (matches: MatchSummary[], team: Team | null): string[] => {
  if (matches.length === 0) return ["Upload more matches to unlock AI insights."];
  
  const insights = [];
  const avgPlace = matches.reduce((a, b) => a + b.placement, 0) / matches.length;
  const avgKills = matches.reduce((a, b) => a + b.totalTeamKills, 0) / matches.length;
  
  // Trend Analysis
  if (matches.length >= 3) {
      const recentThree = matches.slice(0, 3);
      const recentAvgPlace = recentThree.reduce((a,b) => a + b.placement, 0) / 3;
      if (recentAvgPlace < avgPlace - 2) {
          insights.push("📈 Upward Trend: Your placement in the last 3 matches is significantly better than your average.");
      }
      if (recentAvgPlace > avgPlace + 3) {
          insights.push("📉 Slump Alert: Recent placements are below average. Take a break or review VODs.");
      }
  }

  if (avgPlace > 12) insights.push("⚠️ Rotation Crisis: Average placement is low (#" + Math.round(avgPlace) + "). Stop taking early fights.");
  
  if (avgKills > 8) insights.push("🔥 Aggressive Squad: Averaging 8+ kills. Your gunpower is Tier 1 ready.");

  return insights;
};

const generateSquadSuggestions = (matches: MatchSummary[]): string[] => {
    if (matches.length === 0) return ["Upload your first match to get training suggestions."];

    const suggestions = [];
    const avgPlace = matches.reduce((a, b) => a + b.placement, 0) / matches.length;
    const totalKills = matches.reduce((a, b) => a + b.totalTeamKills, 0);
    const totalDamage = matches.reduce((a, b) => a + b.totalTeamDamage, 0);
    const avgKills = totalKills / matches.length;
    
    // Damage conversion rate
    const damagePerKill = totalKills > 0 ? totalDamage / totalKills : 0;

    // 1. Gunpower Check
    if (avgKills < 4) {
        suggestions.push("🎯 Drill: 30mins Team Deathmatch (M416 Only) before scrims.");
        suggestions.push("⚔️ Strategy: Force hot-drops in Unranked for 5 games to build confidence.");
    } else if (damagePerKill > 200) {
        suggestions.push("🎯 Drill: Practice 'Team Firing' counts (3-2-1 Fire) to finish knocks instantly.");
    }

    // 2. Survival Check
    if (avgPlace > 10) {
        suggestions.push("🗺️ Macro: Record your last 3 deaths. Was it a rotation error or a lost fight?");
        suggestions.push("🛡️ Drill: Play 'Edge of Zone' strategy for the next 5 matches. Do not crash center.");
    } else if (avgPlace < 5) {
        suggestions.push("🏆 Macro: You are surviving well. Now try to control a center compound in Zone 3.");
    }

    // 3. Consistency
    if (matches.length > 5) {
        suggestions.push("📅 Routine: Establish a fixed 'IGL Review' session 15 mins after every match block.");
    }

    // Default
    if (suggestions.length === 0) {
        suggestions.push("✅ Maintenance: Keep doing what you're doing. Consistency is key.");
    }

    // Limit to 4 suggestions
    return suggestions.slice(0, 4);
};

// --- API IMPLEMENTATION ---

export const api = {
  // --- AUTH ---
  register: async (email: string, password: string): Promise<{user: User, token: string, setupRequired: boolean}> => {
     const res = await fetch(`${API_URL}/register`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, password })
     });
     if (!res.ok) throw new Error("Registration failed");
     return res.json();
  },

  login: async (email: string, password: string): Promise<{user: User, token: string, setupRequired: boolean}> => {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },

  getGoogleAuthUrl: async (): Promise<string> => {
     const res = await fetch(`${API_URL}/auth/google/url`);
     if (!res.ok) throw new Error("Failed to get Google Auth URL");
     const data = await res.json();
     return data.url;
  },

  getMe: async (): Promise<UserProfile> => {
    const res = await fetch(`${API_URL}/me`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<void> => {
      const res = await fetch(`${API_URL}/me`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to update profile");
  },

  // --- TEAM ---
  getTeam: async (): Promise<Team | null> => {
    const res = await fetch(`${API_URL}/team`, { headers: getHeaders() });
    if (!res.ok) return null;
    return res.json();
  },

  createTeam: async (name: string, players: Player[]): Promise<Team> => {
      const res = await fetch(`${API_URL}/team`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ name, players })
      });
      if (!res.ok) throw new Error("Failed to create team");
      return res.json();
  },

  updateTeam: async (id: string, players: Player[]): Promise<Team> => {
      // In this simple API, create/update share the same endpoint based on user_id
      const team = await api.getTeam();
      return api.createTeam(team?.name || "Squad", players);
  },

  // --- MATCHES ---
  processMatchImages: async (summaryImg: File, scoreboardImg: File): Promise<any> => {
    const formData = new FormData();
    formData.append('images', summaryImg);
    formData.append('images', scoreboardImg);

    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/process-match`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }, // No Content-Type for FormData
        body: formData
    });

    if (!res.ok) {
        // IMPORTANT: Extract error message from backend JSON
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Processing Failed (${res.status})`);
    }
    return res.json();
  },

  saveMatch: async (matchData: any): Promise<MatchSummary> => {
      const team = await api.getTeam();
      
      // Enrich player stats with Role and Analysis locally before saving to DB
      const playersEnriched = matchData.players.map((p: PlayerStat) => {
          const rosterPlayer = team?.players.find(rp => rp.name.toLowerCase() === p.name.toLowerCase());
          const role = rosterPlayer?.role || 'Flex';
          return {
              ...p,
              role,
              analysis: generatePlayerSpecificInsight(p, role, matchData.placement)
          };
      });

      const payload = {
          map: matchData.map,
          placement: matchData.placement,
          players: playersEnriched,
          insights: [] 
      };
      
      // Generate match-wide insights
      // @ts-ignore
      payload.insights = generateMatchInsights({ ...payload, totalTeamKills: 0, totalTeamDamage: 0, players: playersEnriched } as MatchSummary);

      const res = await fetch(`${API_URL}/matches`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save match");
      return res.json();
  },

  getMatches: async (): Promise<MatchSummary[]> => {
      const res = await fetch(`${API_URL}/matches`, { headers: getHeaders() });
      if (!res.ok) return [];
      return res.json();
  },

  deleteMatch: async (id: string): Promise<void> => {
      await fetch(`${API_URL}/matches/${id}`, {
          method: 'DELETE',
          headers: getHeaders()
      });
  },

  // --- NEW: AI COACHING ---
  analyzeSquad: async (matches: MatchSummary[]): Promise<string[]> => {
      const res = await fetch(`${API_URL}/coach/analyze`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ matches })
      });
      if (!res.ok) throw new Error("Failed to analyze squad");
      const data = await res.json();
      return data.suggestions || [];
  },

  getStats: async (): Promise<DashboardStats | null> => {
      const matches = await api.getMatches();
      const team = await api.getTeam();
      
      if (matches.length === 0) return null;

      const totalMatches = matches.length;
      const totalDamage = matches.reduce((acc, m) => acc + m.totalTeamDamage, 0);
      const totalKills = matches.reduce((acc, m) => acc + m.totalTeamKills, 0);
      const placementSum = matches.reduce((acc, m) => acc + m.placement, 0);
      const recentMatches = matches.slice(0, 5); // Already sorted desc from backend

      // Calculate Player Performance
      const playerPerformance = team ? team.players.map(rosterP => {
          let pKills = 0, pDamage = 0, count = 0;
          let totalSurvivalMinutes = 0;
          
          matches.forEach(m => {
              const stat = m.players.find(p => p.name.toLowerCase() === rosterP.name.toLowerCase());
              if(stat) {
                  pKills += stat.kills;
                  pDamage += stat.damage;
                  const [mm, ss] = stat.survivalTime.split(':').map(Number);
                  totalSurvivalMinutes += (mm || 0) + ((ss || 0)/60);
                  count++;
              }
          });
          
          const avgSurvMins = count ? Math.floor(totalSurvivalMinutes / count) : 0;
          const avgSurvSecs = count ? Math.floor((totalSurvivalMinutes * 60) % 60) : 0;

          return {
              name: rosterP.name,
              role: rosterP.role,
              matches: count,
              avgKills: count ? parseFloat((pKills/count).toFixed(1)) : 0,
              avgDamage: count ? Math.round(pDamage/count) : 0,
              avgSurvival: `${avgSurvMins}:${avgSurvSecs.toString().padStart(2, '0')}`
          };
      }) : [];

      return {
          totalMatches,
          avgDamage: Math.round(totalDamage / totalMatches),
          avgKills: (totalKills / totalMatches).toFixed(1),
          avgPlacement: Math.round(placementSum / totalMatches),
          recentMatches,
          kdRatio: (totalKills / totalMatches).toFixed(2),
          playerPerformance,
          strategicInsights: generateGlobalInsights(matches, team),
          squadSuggestions: generateSquadSuggestions(matches) // Starts with local suggestions, UI can upgrade to AI
      };
  }
};
