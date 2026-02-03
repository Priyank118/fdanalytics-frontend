
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

export interface UserProfile extends User {
  bgmi_id?: string;
  bio?: string;
  device?: string;
  tier?: string;
  social_links?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

export type PlayerRole = 'IGL' | 'Fragger' | 'Support' | 'Assaulter' | 'Flex';

export interface Player {
  id?: string;
  name: string;
  role: PlayerRole; // Added Role
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export interface PlayerStat {
  name: string; 
  kills: number;
  assists: number;
  damage: number;
  survivalTime: string; 
  revives: number;
  role?: PlayerRole; // Snapshot of role during match
  analysis?: string[]; // Changed to array for multiple tips
}

export interface MatchSummary {
  id: string;
  createdAt: string; 
  map: string;
  placement: number;
  totalTeamKills: number;
  totalTeamDamage: number;
  teamName?: string;
  players: PlayerStat[];
  insights?: string[]; // Added match-specific insights
}

export interface DashboardStats {
  totalMatches: number;
  avgDamage: number;
  avgKills: string;
  avgPlacement: number;
  kdRatio: string;
  recentMatches: MatchSummary[];
  playerPerformance: {
    name: string;
    role: string;
    matches: number;
    avgKills: number;
    avgDamage: number;
    avgSurvival: string;
  }[];
  strategicInsights: string[]; // Global insights (Observations)
  squadSuggestions: string[]; // NEW: Actionable recommendations (Drills/Actions)
}

export enum AppState {
  LANDING,
  AUTH,
  DASHBOARD,
  HISTORY,
  UPLOAD,
  PROFILE,
  TEAM
}
