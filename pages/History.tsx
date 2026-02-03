
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { MatchSummary, Team } from '../types';
import { Trash2, Map as MapIcon, Sparkles, Swords, Shield, Anchor, Crosshair, Users, AlertTriangle, Zap, BarChart2, ChevronDown, ChevronUp, Filter, Trophy, Clock, Skull, Award, Activity, PieChart as PieChartIcon, Table } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Legend } from 'recharts';

const HistorySkeleton = () => (
    <div className="p-4 md:p-10 pb-24 max-w-[1800px] mx-auto animate-fade-in">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
                 <div className="h-10 w-48 bg-slate-800/50 rounded-xl animate-pulse"></div>
                 <div className="h-4 w-64 bg-slate-800/50 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-10 w-full md:w-96 bg-slate-800/50 rounded-2xl animate-pulse"></div>
        </div>
        
        <div className="masonry-grid">
            {[1,2,3,4].map(i => (
                <div key={i} className="break-inside-avoid glass-panel rounded-[2rem] overflow-hidden mb-8 border border-white/5 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-shimmer"></div>
                    <div className="h-48 bg-slate-800/50 animate-pulse"></div>
                    <div className="p-6 space-y-4">
                        <div className="h-16 w-full bg-slate-700/30 rounded-2xl animate-pulse"></div>
                        <div className="space-y-3">
                             <div className="h-12 w-full bg-slate-700/20 rounded-xl animate-pulse"></div>
                             <div className="h-12 w-full bg-slate-700/20 rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const COLORS = ['#818cf8', '#34d399', '#f43f5e', '#fbbf24', '#a78bfa'];

export const MatchHistory: React.FC = () => {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterMap, setFilterMap] = useState<string>("All");
  const [filterOutcome, setFilterOutcome] = useState<string>("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchData, teamData] = await Promise.all([
             api.getMatches(),
             api.getTeam()
        ]);
        setMatches(matchData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setTeam(teamData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this match record?")) {
      try {
        await api.deleteMatch(id);
        setMatches(prev => prev.filter(m => m.id !== id));
      } catch (error) {
        alert("Failed to delete match");
      }
    }
  };

  const toggleExpand = (id: string) => {
      if (expandedMatchId === id) {
          setExpandedMatchId(null);
      } else {
          setExpandedMatchId(id);
          setActiveTab('overview');
      }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
        case 'Fragger': return <Swords size={14} className="text-rose-400" />;
        case 'IGL': return <Shield size={14} className="text-blue-400" />;
        case 'Support': return <Anchor size={14} className="text-emerald-400" />;
        case 'Assaulter': return <Crosshair size={14} className="text-orange-400" />;
        default: return <Users size={14} className="text-slate-400" />;
    }
  };

  const parseTime = (timeStr: string) => {
      const [m, s] = timeStr.split(':').map(Number);
      return (m || 0) + ((s || 0) / 60);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl z-50">
          <p className="text-white font-bold text-xs mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
             <p key={index} className="text-[10px] font-medium" style={{ color: entry.color || entry.fill }}>
                {entry.name}: {typeof entry.value === 'number' ? Math.round(entry.value * 100) / 100 : entry.value}
                {entry.unit}
             </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Filter Logic
  const filteredMatches = matches.filter(match => {
      const mapMatch = filterMap === "All" || match.map === filterMap;
      let outcomeMatch = true;
      if (filterOutcome === "Wins") outcomeMatch = match.placement === 1;
      if (filterOutcome === "Top 10") outcomeMatch = match.placement <= 10;
      if (filterOutcome === "Bad Games") outcomeMatch = match.placement > 10;
      return mapMatch && outcomeMatch;
  });

  const availableMaps = Array.from(new Set(matches.map(m => m.map))).filter(Boolean);

  if (loading) return <HistorySkeleton />;

  return (
    <div className="p-4 md:p-10 pb-24 max-w-[1800px] mx-auto animate-fade-in">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Match Feed</h1>
            <p className="text-slate-400 mt-2 font-medium text-sm md:text-base">Detailed breakdown of every skirmish.</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex flex-wrap gap-2 shadow-xl justify-center md:justify-start">
            <div className="flex items-center gap-2 px-3 py-2 border-r border-white/10">
                <Filter size={16} className="text-primary-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filters</span>
            </div>
            
            <select 
                value={filterMap} 
                onChange={(e) => setFilterMap(e.target.value)}
                className="bg-slate-800 text-white text-sm font-bold px-4 py-2 rounded-xl outline-none border border-transparent hover:border-slate-600 focus:border-primary-500 transition-colors cursor-pointer appearance-none"
            >
                <option value="All">All Maps</option>
                {availableMaps.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <select 
                value={filterOutcome} 
                onChange={(e) => setFilterOutcome(e.target.value)}
                className="bg-slate-800 text-white text-sm font-bold px-4 py-2 rounded-xl outline-none border border-transparent hover:border-slate-600 focus:border-primary-500 transition-colors cursor-pointer appearance-none"
            >
                <option value="All">All Outcomes</option>
                <option value="Wins">Wins (#1)</option>
                <option value="Top 10">Top 10</option>
                <option value="Bad Games">Bottom 50%</option>
            </select>
            
            {(filterMap !== "All" || filterOutcome !== "All") && (
                <button 
                    onClick={() => { setFilterMap("All"); setFilterOutcome("All"); }}
                    className="px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                >
                    Reset
                </button>
            )}
        </div>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/30 rounded-[2rem] border border-dashed border-slate-700">
           <p className="text-slate-500 font-medium">No matches found.</p>
           <button onClick={() => { setFilterMap("All"); setFilterOutcome("All"); }} className="mt-4 text-primary-400 font-bold hover:text-white">Clear Filters</button>
        </div>
      ) : (
        <div className="masonry-grid">
          {filteredMatches.map((match) => {
            const isExpanded = expandedMatchId === match.id;
            
            // --- DATA PREPARATION ---
            // 1. Comparison Data
            const comparisonData = match.players.map(p => ({
                name: p.name,
                Kills: p.kills,
                Damage: p.damage
            }));

            // 2. Pie Chart Data
            const damageData = match.players.map(p => ({
                name: p.name,
                value: p.damage
            })).filter(p => p.value > 0);

            // 3. Survival Data
            const survivalData = match.players.map(p => ({
                name: p.name,
                Minutes: parseTime(p.survivalTime)
            })).sort((a,b) => b.Minutes - a.Minutes);

            // 4. Find MVP
            const mvpPlayer = match.players.reduce((prev, current) => {
                const prevScore = (prev.kills * 10) + (prev.damage / 100);
                const currScore = (current.kills * 10) + (current.damage / 100);
                return (prevScore > currScore) ? prev : current;
            });
            const mvpRole = mvpPlayer.role || (team?.players.find(tp => tp.name === mvpPlayer.name)?.role || 'Flex');

            return (
            <div key={match.id} className={`break-inside-avoid glass-panel rounded-[2rem] overflow-hidden group relative transition-all duration-300 border border-white/5 bg-slate-900 mb-8 ${isExpanded ? 'ring-2 ring-primary-500/50 shadow-2xl scale-[1.01] z-10 col-span-1 md:col-span-2' : 'hover:shadow-2xl hover:-translate-y-2'}`}>
                
                {/* --- HEADER IMAGE AREA --- */}
                <div onClick={() => toggleExpand(match.id)} className="cursor-pointer">
                    <div className={`h-40 md:h-48 relative overflow-hidden ${
                        match.map === 'Erangel' ? 'bg-[url("https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop")]' : 
                        match.map === 'Miramar' ? 'bg-[url("https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2070&auto=format&fit=crop")]' : 
                        match.map === 'Sanhok' ? 'bg-[url("https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop")]' : 'bg-slate-800'
                    } bg-cover bg-center`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                        
                        <div className="absolute top-4 left-4">
                            <div className={`px-3 py-1.5 md:px-4 md:py-2 rounded-2xl backdrop-blur-md flex flex-col items-center ${
                                match.placement === 1 ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'bg-black/40 border border-white/10 text-white'
                            }`}>
                                <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest opacity-80">Rank</span>
                                <span className="text-xl md:text-2xl font-black">#{match.placement}</span>
                            </div>
                        </div>

                        <div className="absolute top-4 right-4">
                            <div className="flex items-center gap-1.5 text-white/90 text-xs font-bold bg-black/40 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
                                <MapIcon size={12}/> {match.map}
                            </div>
                        </div>

                        {/* Summary Bar overlaying image */}
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                             <div className="flex gap-4">
                                 <div>
                                     <p className="text-[9px] md:text-[10px] font-bold text-slate-300 uppercase shadow-black drop-shadow-md">Kills</p>
                                     <p className="text-xl md:text-2xl font-black text-white drop-shadow-lg">{match.totalTeamKills}</p>
                                 </div>
                                 <div>
                                     <p className="text-[9px] md:text-[10px] font-bold text-slate-300 uppercase shadow-black drop-shadow-md">Damage</p>
                                     <p className="text-xl md:text-2xl font-black text-white drop-shadow-lg">{match.totalTeamDamage}</p>
                                 </div>
                             </div>
                             <div className="text-xs font-medium text-slate-300 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                                {new Date(match.createdAt).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                             </div>
                        </div>
                    </div>
                </div>
                
                {/* --- EXPANDED CONTENT --- */}
                {isExpanded ? (
                    <div className="bg-slate-950/30 animate-fade-in border-t border-white/5">
                        {/* Tabs */}
                        <div className="flex border-b border-white/5">
                            <button 
                                onClick={() => setActiveTab('overview')}
                                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'overview' ? 'bg-white/5 text-white border-b-2 border-primary-500' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <div className="flex items-center justify-center gap-2"><Table size={14}/> Scoreboard</div>
                            </button>
                            <button 
                                onClick={() => setActiveTab('analytics')}
                                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'analytics' ? 'bg-white/5 text-white border-b-2 border-primary-500' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <div className="flex items-center justify-center gap-2"><PieChartIcon size={14}/> Analytics</div>
                            </button>
                        </div>

                        <div className="p-4 md:p-6">
                            
                            {/* TAB 1: OVERVIEW */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    {/* MVP Card */}
                                    <div className="bg-gradient-to-r from-slate-900 to-indigo-900/20 rounded-2xl p-4 border border-indigo-500/20 flex items-center justify-between relative overflow-hidden">
                                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-indigo-500/10 blur-[40px]"></div>
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                                                <Award size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Match MVP</span>
                                                    <span className="bg-indigo-500/20 text-indigo-300 text-[9px] px-1.5 rounded uppercase font-bold">{mvpRole}</span>
                                                </div>
                                                <div className="text-xl font-black text-white">{mvpPlayer.name}</div>
                                                <div className="text-[10px] text-slate-400 mt-0.5">Most valuable impact rating</div>
                                            </div>
                                        </div>
                                        <div className="text-right relative z-10">
                                            <div className="text-lg font-black text-white">{mvpPlayer.kills} <span className="text-xs font-medium text-slate-500">Kills</span></div>
                                            <div className="text-sm font-bold text-indigo-400">{mvpPlayer.damage} <span className="text-[10px] text-indigo-400/70">DMG</span></div>
                                        </div>
                                    </div>

                                    {/* Detailed Table */}
                                    <div className="overflow-x-auto rounded-2xl border border-white/5">
                                        <table className="w-full text-left border-collapse min-w-[600px]">
                                            <thead>
                                                <tr className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-white/5">
                                                    <th className="p-3 font-bold">Player</th>
                                                    <th className="p-3 font-bold text-center">Kills</th>
                                                    <th className="p-3 font-bold text-center">Assists</th>
                                                    <th className="p-3 font-bold text-center">Dmg</th>
                                                    <th className="p-3 font-bold text-center">Surv</th>
                                                    <th className="p-3 font-bold text-center">Rev</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {match.players.map((p, i) => {
                                                    const role = p.role || (team?.players.find(tp => tp.name === p.name)?.role || 'Flex');
                                                    return (
                                                        <React.Fragment key={i}>
                                                        <tr className="hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors">
                                                            <td className="p-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-1.5 bg-slate-800 rounded-lg text-slate-400">
                                                                        {getRoleIcon(role)}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold text-white">{p.name}</div>
                                                                        <div className="text-[10px] text-slate-500 font-bold uppercase">{role}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-3 text-center font-bold text-white bg-white/5">{p.kills}</td>
                                                            <td className="p-3 text-center text-slate-300">{p.assists}</td>
                                                            <td className="p-3 text-center font-mono text-indigo-400 font-bold">{p.damage}</td>
                                                            <td className="p-3 text-center text-slate-400">{p.survivalTime}</td>
                                                            <td className="p-3 text-center text-emerald-400 font-bold">{p.revives}</td>
                                                        </tr>
                                                        {/* Inline Analysis Tip */}
                                                        {p.analysis && p.analysis.length > 0 && (
                                                            <tr className="bg-slate-900/40">
                                                                <td colSpan={6} className="px-3 py-2 border-b border-white/5">
                                                                     <div className="flex gap-2 items-start text-[10px] text-slate-400 italic">
                                                                         <Sparkles size={12} className="shrink-0 mt-0.5 text-indigo-500" />
                                                                         <span>{p.analysis[0].replace(/^[⚠️✅💡🔥]\s*/, '')}</span>
                                                                     </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                        </React.Fragment>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: ANALYTICS */}
                            {activeTab === 'analytics' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        
                                        {/* Chart 1: Damage Share */}
                                        <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/5 flex flex-col items-center">
                                            <div className="flex items-center gap-2 mb-2 w-full">
                                                <PieChartIcon size={14} className="text-indigo-400"/>
                                                <h4 className="text-xs font-bold text-white uppercase">Damage Share</h4>
                                            </div>
                                            <div className="h-48 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={damageData}
                                                            cx="50%"
                                                            cy="45%"
                                                            innerRadius={40}
                                                            outerRadius={60}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                            stroke="none"
                                                        >
                                                            {damageData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend wrapperStyle={{fontSize: '10px', paddingTop: '10px'}} layout="horizontal" align="center" verticalAlign="bottom"/>
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Chart 2: Survival Timeline */}
                                        <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/5">
                                            <div className="flex items-center gap-2 mb-4 w-full">
                                                <Clock size={14} className="text-emerald-400"/>
                                                <h4 className="text-xs font-bold text-white uppercase">Survival Time (Mins)</h4>
                                            </div>
                                            <div className="h-48 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={survivalData} layout="vertical" margin={{left: 0, right: 20}}>
                                                        <CartesianGrid stroke="#334155" horizontal={false} opacity={0.3} />
                                                        <XAxis type="number" hide />
                                                        <YAxis dataKey="name" type="category" width={110} tick={{fontSize: 10, fill: '#cbd5e1'}} axisLine={false} tickLine={false} />
                                                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                                                        <Bar dataKey="Minutes" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12}>
                                                            {survivalData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fillOpacity={entry.Minutes > 20 ? 1 : 0.6} fill="#10b981" />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Chart 3: Efficiency Comparison */}
                                    <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/5">
                                        <div className="flex items-center gap-2 mb-4 w-full">
                                            <Activity size={14} className="text-rose-400"/>
                                            <h4 className="text-xs font-bold text-white uppercase">Combat Efficiency</h4>
                                        </div>
                                        <div className="h-56 w-full">
                                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                                <BarChart data={comparisonData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                                    <XAxis dataKey="name" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                                                    <Bar dataKey="Damage" fill="#818cf8" radius={[4, 4, 0, 0]} name="Damage" unit=" pts" />
                                                    <Bar dataKey="Kills" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Kills" unit="" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Collapse Button */}
                            <button onClick={() => toggleExpand(match.id)} className="w-full mt-6 py-3 rounded-xl border border-white/5 text-slate-500 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider">
                                <ChevronUp size={14} /> Close Details
                            </button>
                        </div>
                    </div>
                ) : (
                    // --- COLLAPSED SUMMARY ---
                    <div className="px-4 py-3 md:px-6 md:py-4 flex justify-between items-center bg-slate-900/50 group-hover:bg-slate-800/50 transition-colors">
                        <div className="flex gap-2">
                             {match.players.map((p, i) => (
                                 <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[9px] md:text-[10px] font-bold text-slate-400" title={`${p.name}: ${p.kills}K`}>
                                     {p.name.substring(0,1)}
                                 </div>
                             ))}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] md:text-xs font-bold uppercase cursor-pointer hover:text-white" onClick={() => toggleExpand(match.id)}>
                            <span className="hidden sm:inline">View Analysis</span> <span className="sm:hidden">View</span> <ChevronDown size={14} />
                        </div>
                    </div>
                )}

                {/* Delete Action */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button 
                        onClick={(e) => handleDelete(match.id, e)}
                        className="p-2.5 bg-red-500/80 hover:bg-red-500 text-white rounded-xl shadow-xl hover:scale-110 transition-transform backdrop-blur-md"
                        title="Delete Match"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            )
          })}
        </div>
      )}
    </div>
  );
};
