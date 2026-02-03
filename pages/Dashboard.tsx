
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, Legend } from 'recharts';
import { ArrowUpRight, Target, Trophy, Activity, Plus, Lightbulb, Users, Swords, Shield, Crosshair, Anchor, Zap, TrendingUp, Sparkles, Hexagon, Map as MapIcon, ClipboardList, Dumbbell, CheckCircle2, Bot } from 'lucide-react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { DashboardStats } from '../types';

const StatCard = ({ title, value, sub, icon: Icon, colorClass = "text-primary-400" }: any) => (
  <div className="glass-panel p-5 md:p-6 rounded-3xl transition-all duration-300 group hover:bg-slate-800/80 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-900/10 border border-white/5">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-400 text-[10px] md:text-[11px] font-bold uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">{value}</h3>
      </div>
      <div className={`p-2.5 md:p-3 bg-slate-900/50 rounded-2xl ${colorClass} shadow-inner border border-white/5`}>
        <Icon size={20} className="md:w-6 md:h-6" />
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="flex items-center bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
         <ArrowUpRight size={12} className="text-emerald-400 mr-1" /> 
         <span className="text-emerald-400 text-xs font-bold">Rising</span>
      </div>
      <span className="text-slate-500 text-xs font-medium">{sub}</span>
    </div>
  </div>
);

const getRoleIcon = (role: string) => {
    switch (role) {
        case 'Fragger': return <Swords size={16} className="text-rose-400" />;
        case 'IGL': return <Shield size={16} className="text-blue-400" />;
        case 'Support': return <Anchor size={16} className="text-emerald-400" />;
        case 'Assaulter': return <Crosshair size={16} className="text-orange-400" />;
        default: return <Users size={16} className="text-slate-400" />;
    }
};

const DashboardSkeleton = () => (
    <div className="p-4 md:p-10 space-y-8 md:space-y-10 animate-fade-in pb-24 max-w-[1800px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-6">
        <div className="space-y-4 w-full md:w-auto">
             <div className="h-10 md:h-12 w-48 md:w-64 bg-slate-800/50 rounded-2xl animate-pulse"></div>
             <div className="h-6 w-32 md:w-40 bg-slate-800/50 rounded-xl animate-pulse"></div>
        </div>
        <div className="h-12 w-full md:w-40 bg-slate-800/50 rounded-2xl animate-pulse"></div>
      </div>

      <div className="masonry-grid">
         {[1, 2, 3, 4, 5, 6].map(i => (
             <div key={i} className="break-inside-avoid glass-panel p-6 rounded-[2rem] border border-white/5 space-y-6 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-shimmer"></div>
                 <div className="flex justify-between items-start">
                     <div className="space-y-2">
                        <div className="h-4 w-24 bg-slate-700/50 rounded animate-pulse"></div>
                        <div className="h-10 w-32 bg-slate-700/50 rounded animate-pulse"></div>
                     </div>
                     <div className="h-12 w-12 bg-slate-700/50 rounded-2xl animate-pulse"></div>
                 </div>
                 <div className="h-32 w-full bg-slate-700/20 rounded-2xl animate-pulse"></div>
             </div>
         ))}
      </div>
    </div>
);

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [user, setUser] = useState<string>("Player");
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.getStats();
        setStats(data);
        const token = localStorage.getItem("token");
        if(token) {
           const payload = JSON.parse(atob(token.split('.')[1]));
           setUser(payload.username || "Player");
        }
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const handleAiAnalyze = async () => {
     if(!stats?.recentMatches) return;
     setAiLoading(true);
     try {
         const suggestions = await api.analyzeSquad(stats.recentMatches);
         setAiSuggestions(suggestions);
     } catch (e) {
         alert("Failed to get AI analysis.");
     } finally {
         setAiLoading(false);
     }
  };

  const currentSuggestions = aiSuggestions.length > 0 ? aiSuggestions : (stats?.squadSuggestions || []);
  const isAiActive = aiSuggestions.length > 0;

  if (loading) return <DashboardSkeleton />;

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-6 animate-fade-in bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl border border-slate-700/50 rotate-3">
           <Activity className="text-primary-500" size={48} />
        </div>
        <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Your Dashboard Awaits</h2>
        <p className="text-slate-400 max-w-md mb-8 leading-relaxed">Upload your first match result to kickstart the AI analysis engine.</p>
        <Link to="/upload" className="bg-white text-slate-950 hover:bg-slate-200 px-8 py-4 rounded-full font-bold shadow-lg shadow-white/10 transition-all flex items-center gap-2 transform hover:-translate-y-1 hover:shadow-xl">
           <Plus size={20} /> Upload Match
        </Link>
      </div>
    );
  }

  // --- ANALYTICS PROCESSING ---

  // 1. Damage Trend (Area)
  const chartData = stats.recentMatches.map((m: any, i: number) => ({
    name: `M${i+1}`,
    damage: m.totalTeamDamage,
    kills: m.totalTeamKills,
    placement: m.placement
  })).reverse(); 

  // 2. Radar Data (Playstyle)
  const maxAvgKills = 10;
  const maxAvgDmg = 1200;
  const radarData = [
      { subject: 'Aggression', A: Math.min((parseFloat(stats.avgKills) / maxAvgKills) * 100, 100), fullMark: 100 },
      { subject: 'Survival', A: Math.min((stats.avgPlacement < 5 ? 100 : (20 - stats.avgPlacement) * 5), 100), fullMark: 100 },
      { subject: 'Gunpower', A: Math.min((stats.avgDamage / maxAvgDmg) * 100, 100), fullMark: 100 },
      { subject: 'Consistency', A: Math.min(stats.totalMatches * 10, 100), fullMark: 100 }, // Simple proxy
      { subject: 'Placement', A: Math.min((1 / stats.avgPlacement) * 500, 100), fullMark: 100 },
  ];

  // 3. Player Comparison (Bar)
  const rosterData = stats.playerPerformance.map(p => ({
      name: p.name,
      Kills: p.avgKills,
      Damage: p.avgDamage / 100 // Scale damage down to fit graph with kills
  }));

  // 4. Map Analytics Logic
  const mapStatsRaw: Record<string, {matches: number, kills: number, placementSum: number, wins: number}> = {};
  stats.recentMatches.forEach(m => {
      const map = m.map || "Unknown";
      if (!mapStatsRaw[map]) mapStatsRaw[map] = { matches: 0, kills: 0, placementSum: 0, wins: 0 };
      mapStatsRaw[map].matches++;
      mapStatsRaw[map].kills += m.totalTeamKills;
      mapStatsRaw[map].placementSum += m.placement;
      if (m.placement === 1) mapStatsRaw[map].wins++;
  });

  const mapStats = Object.keys(mapStatsRaw).map(key => {
      const d = mapStatsRaw[key];
      return {
          name: key,
          matches: d.matches,
          avgKills: (d.kills / d.matches).toFixed(1),
          avgRank: (d.placementSum / d.matches).toFixed(1),
          winRate: Math.round((d.wins / d.matches) * 100)
      };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl z-50">
          <p className="text-white font-bold text-sm mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
             <p key={index} className="text-xs font-medium" style={{ color: entry.color }}>
                {entry.name}: {entry.value}
             </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 md:p-10 space-y-8 md:space-y-10 animate-fade-in pb-24 max-w-[1800px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-3 flex-wrap">
             Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400 capitalize">{user}</span>
             <span className="text-2xl animate-pulse">👋</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium text-base md:text-lg">Your squad's competitive feed.</p>
        </div>
        <Link to="/upload" className="w-full md:w-auto justify-center bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary-600/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-95">
           <Plus size={20} /> Add Match
        </Link>
      </div>

      <div className="masonry-grid">
        
        {/* Insight Pin - Coach's Corner */}
        {stats.strategicInsights && stats.strategicInsights.length > 0 && (
            <div className="break-inside-avoid glass-panel p-5 md:p-6 rounded-[2rem] border-l-4 border-l-indigo-500 bg-gradient-to-br from-slate-900 to-indigo-900/10 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-indigo-500 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
                        <Sparkles size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Coach's Corner</h3>
                </div>
                <ul className="space-y-4">
                    {stats.strategicInsights.map((insight, idx) => (
                        <li key={idx} className="text-indigo-100 text-sm leading-relaxed flex items-start gap-3 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                             <div className="mt-1.5 min-w-[6px] h-[6px] rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
                            {insight}
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* Squad Recommendations (UPDATED) */}
        <div className={`break-inside-avoid glass-panel p-5 md:p-6 rounded-[2rem] border-l-4 ${isAiActive ? 'border-l-purple-500 bg-gradient-to-br from-slate-900 to-purple-900/10' : 'border-l-emerald-500 bg-gradient-to-br from-slate-900 to-emerald-900/10'}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl text-white shadow-lg ${isAiActive ? 'bg-purple-500 shadow-purple-500/30' : 'bg-emerald-500 shadow-emerald-500/30'}`}>
                        {isAiActive ? <Bot size={20} /> : <ClipboardList size={20} />}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Training Plan</h3>
                        <p className={`text-[10px] font-bold uppercase tracking-wide ${isAiActive ? 'text-purple-400' : 'text-emerald-400'}`}>
                            {isAiActive ? "AI Generated Strategy" : "Standard Drills"}
                        </p>
                    </div>
                </div>
                {!isAiActive && stats.recentMatches.length > 0 && (
                    <button 
                        onClick={handleAiAnalyze}
                        disabled={aiLoading}
                        className="text-[10px] font-bold bg-white text-slate-900 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors flex items-center gap-1"
                    >
                        {aiLoading ? "Thinking..." : <><Bot size={12}/> ASK AI</>}
                    </button>
                )}
            </div>
            
            <div className="space-y-3">
                {currentSuggestions.length > 0 ? currentSuggestions.map((suggestion, idx) => (
                    <div key={idx} className={`flex items-start gap-3 p-3 rounded-xl border border-white/5 transition-colors ${isAiActive ? 'bg-purple-500/10 border-purple-500/20' : 'bg-slate-950/30'}`}>
                        {suggestion.includes('Drill') ? (
                            <Dumbbell size={16} className="text-rose-400 shrink-0 mt-0.5" />
                        ) : suggestion.includes('Macro') ? (
                            <MapIcon size={16} className="text-blue-400 shrink-0 mt-0.5" />
                        ) : (
                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                        )}
                        <span className="text-sm text-slate-300 font-medium leading-tight">
                            {suggestion.replace(/^(🎯 Drill:|⚔️ Strategy:|🗺️ Macro:|🛡️ Drill:|🏆 Macro:|📅 Routine:|✅ Maintenance:)/, "")}
                        </span>
                    </div>
                )) : (
                    <p className="text-slate-500 text-sm italic">Play more matches to generate a training plan.</p>
                )}
            </div>
        </div>

        {/* Stats Row */}
        <div className="break-inside-avoid space-y-6">
            <StatCard title="Avg Damage" value={stats.avgDamage.toLocaleString()} sub="Team Total" icon={Swords} colorClass="text-indigo-400" />
            <StatCard title="Kill/Death" value={stats.kdRatio} sub="Ratio" icon={Activity} colorClass="text-rose-400" />
        </div>

        {/* RADAR CHART: Playstyle Analysis */}
        <div className="break-inside-avoid glass-panel p-5 md:p-6 rounded-[2rem] flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-white">Squad Identity</h3>
                <Hexagon size={18} className="text-emerald-400" />
            </div>
            <div className="h-64 w-full relative">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Squad" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                        <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-slate-500 font-medium">Based on recent 5 matches</p>
        </div>

        {/* MAP MASTERY SECTION */}
        {mapStats.length > 0 && (
        <div className="break-inside-avoid glass-panel p-5 md:p-6 rounded-[2rem]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Map Mastery</h3>
                <MapIcon size={18} className="text-teal-400" />
            </div>
            <div className="space-y-3">
                {mapStats.map((map, i) => (
                    <div key={i} className="bg-slate-800/50 p-3 rounded-xl border border-white/5 flex justify-between items-center">
                        <div>
                            <span className="text-sm font-bold text-white block">{map.name}</span>
                            <span className="text-[10px] text-slate-500 font-medium">{map.matches} Matches played</span>
                        </div>
                        <div className="text-right flex gap-4">
                            <div>
                                <span className="block text-xs font-bold text-emerald-400">{map.avgKills}</span>
                                <span className="text-[9px] text-slate-500 uppercase font-bold">Avg Kills</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-amber-400">#{map.avgRank}</span>
                                <span className="text-[9px] text-slate-500 uppercase font-bold">Avg Rank</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        )}

        {/* DAMAGE TREND CHART */}
        <div className="break-inside-avoid glass-panel p-5 md:p-6 rounded-[2rem]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Damage History</h3>
            <div className="bg-primary-500/10 p-2 rounded-xl text-primary-400">
               <TrendingUp size={18} />
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDamage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} cursor={{stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2}} />
                <Area type="monotone" dataKey="damage" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorDamage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PLACEMENT HISTORY (Inverted Line Chart) */}
        <div className="break-inside-avoid glass-panel p-5 md:p-6 rounded-[2rem]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Placement Consistency</h3>
                <Trophy size={18} className="text-amber-400" />
            </div>
            <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <LineChart data={chartData}>
                        <CartesianGrid vertical={false} stroke="#1e293b" />
                        <XAxis dataKey="name" hide />
                        <YAxis reversed domain={[1, 20]} hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="placement" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: "#f59e0b" }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-xs text-slate-500 px-2 mt-2">
                <span>Oldest</span>
                <span>Newest</span>
            </div>
        </div>

        {/* Stats Row 2 */}
        <div className="break-inside-avoid space-y-6">
            <StatCard title="Avg Rank" value={`#${stats.avgPlacement}`} sub="Placement" icon={Trophy} colorClass="text-amber-400" />
            <StatCard title="Avg Kills" value={stats.avgKills} sub="Aggression" icon={Target} colorClass="text-emerald-400" />
        </div>

        {/* ROSTER COMPARISON CHART */}
        <div className="break-inside-avoid glass-panel p-5 md:p-6 rounded-[2rem]">
             <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Roster Performance</h3>
                <span className="text-xs text-slate-500">Avg / Match</span>
             </div>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={rosterData} layout="vertical">
                        <CartesianGrid stroke="#1e293b" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" tick={{fill: '#94a3b8', fontSize: 10}} width={60} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="Kills" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={12} />
                        <Bar dataKey="Damage" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={12} />
                        <Legend iconType="circle" wrapperStyle={{fontSize: '10px', paddingTop: '10px'}} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
             <p className="text-[10px] text-slate-500 text-center mt-2">*Damage scaled /100 for comparison</p>
        </div>

        {/* Active Roster List */}
        <div className="break-inside-avoid glass-panel p-0 rounded-[2rem] overflow-hidden border border-white/5">
             <div className="p-5 md:p-6 bg-slate-800/50 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Squad Stats</h3>
                <Link to="/team" className="text-xs font-bold bg-white text-slate-900 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors">MANAGE</Link>
             </div>
             <div className="p-2">
                {stats.playerPerformance.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-3xl transition-colors group cursor-default">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 shadow-lg group-hover:scale-110 group-hover:bg-slate-700 transition-all duration-300">
                                {getRoleIcon(p.role)}
                            </div>
                            <div>
                                <div className="font-bold text-white text-sm">{p.name}</div>
                                <div className="flex gap-2 text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">
                                    <span>{p.role}</span>
                                    <span>•</span>
                                    <span>Surv: {p.avgSurvival}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-white font-black text-lg">{p.avgKills} <span className="text-xs font-medium text-slate-500">K/M</span></div>
                             <div className="text-xs text-indigo-400 font-bold">{p.avgDamage} Dmg</div>
                        </div>
                    </div>
                ))}
             </div>
        </div>

      </div>
    </div>
  );
};
