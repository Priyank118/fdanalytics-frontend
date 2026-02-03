
import React, { useState, useEffect } from 'react';
import { Users, Save, Plus, Trash2, Shield, Crosshair, Anchor, Swords, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { Team, Player, PlayerRole } from '../types';
import { useNavigate } from 'react-router-dom';

const ROLES: {value: PlayerRole, label: string, icon: any}[] = [
    { value: 'IGL', label: 'IGL', icon: Shield },
    { value: 'Fragger', label: 'Fragger', icon: Swords },
    { value: 'Assaulter', label: 'Assaulter', icon: Crosshair },
    { value: 'Support', label: 'Support', icon: Anchor },
    { value: 'Flex', label: 'Flex', icon: Users },
];

const TeamSkeleton = () => (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 animate-fade-in">
        <div className="flex flex-col gap-2">
            <div className="h-10 w-64 bg-slate-800/50 rounded-xl animate-pulse"></div>
            <div className="h-4 w-96 bg-slate-800/50 rounded-lg animate-pulse"></div>
        </div>
        
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-700/50 space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-shimmer"></div>
            
            <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-700/50 rounded animate-pulse"></div>
                <div className="h-12 w-full bg-slate-700/30 rounded-lg animate-pulse"></div>
            </div>

            <div className="space-y-4">
                <div className="h-4 w-32 bg-slate-700/50 rounded animate-pulse"></div>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex gap-3">
                        <div className="h-12 w-12 bg-slate-700/30 rounded-lg animate-pulse"></div>
                        <div className="h-12 flex-1 bg-slate-700/30 rounded-lg animate-pulse"></div>
                        <div className="h-12 w-48 bg-slate-700/30 rounded-lg animate-pulse"></div>
                    </div>
                ))}
            </div>
            
            <div className="flex justify-end pt-4">
                <div className="h-12 w-40 bg-slate-700/50 rounded-lg animate-pulse"></div>
            </div>
        </div>
    </div>
);

export const TeamPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState<Player[]>([
      { name: "", role: "IGL" },
      { name: "", role: "Fragger" },
      { name: "", role: "Assaulter" },
      { name: "", role: "Support" }
  ]); 
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      const data = await api.getTeam();
      if (data) {
        setTeam(data);
        setTeamName(data.name);
        setPlayers(data.players);
        setIsNew(false);
      } else {
        setIsNew(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerChange = (index: number, field: keyof Player, value: string) => {
    const newPlayers = [...players];
    // @ts-ignore
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  };

  const addPlayerSlot = () => setPlayers([...players, { name: "", role: "Flex" }]);
  
  const removePlayerSlot = (index: number) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
  };

  const handleSave = async () => {
    const validPlayers = players.filter(p => p.name.trim() !== "");
    if (!teamName || validPlayers.length < 1) {
      alert("Please enter a team name and at least one player.");
      return;
    }

    try {
      setLoading(true);
      if (isNew) {
        await api.createTeam(teamName, validPlayers);
      } else {
        if(team) await api.updateTeam(team.id, validPlayers);
      }
      // If user was redirected here after registration, now send to dashboard
      navigate('/dashboard');
    } catch (e) {
      alert("Failed to save team.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !team && !isNew) return <TeamSkeleton />;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-white">My Squad Configuration</h1>
        <p className="text-slate-400 text-sm md:text-base">
          Define your roster and assign roles. The AI uses these roles to provide personalized performance recommendations.
        </p>
      </div>

      <div className="glass-panel p-4 md:p-8 rounded-2xl border border-slate-700/50 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Team Name</label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            disabled={!isNew && !!team} 
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="e.g. Soul Esports"
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-300 mb-4">Active Roster</label>
           <div className="space-y-4">
             {players.map((player, idx) => (
               <div key={idx} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 font-bold text-sm">
                    {idx + 1}
                  </div>
                  
                  {/* Name Input */}
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => handlePlayerChange(idx, 'name', e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 outline-none w-full"
                    placeholder="In-Game Name (IGN)"
                  />

                  {/* Role Selector */}
                  <div className="relative group w-full md:w-48">
                      <select 
                        value={player.role}
                        onChange={(e) => handlePlayerChange(idx, 'role', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 outline-none appearance-none cursor-pointer"
                      >
                          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                      <div className="absolute right-3 top-2.5 pointer-events-none text-slate-500">
                          <Shield size={14} />
                      </div>
                  </div>

                  {players.length > 1 && (
                    <button onClick={() => removePlayerSlot(idx)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  )}
               </div>
             ))}
           </div>
           
           <button onClick={addPlayerSlot} className="mt-4 flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium text-sm">
             <Plus size={16} /> Add Substitute
           </button>
        </div>

        <div className="pt-6 border-t border-slate-700/50 flex justify-end">
           <button 
             onClick={handleSave}
             className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all"
           >
             <Save size={20} /> {isNew ? "Create Team & Continue" : "Update Roster"}
           </button>
        </div>
      </div>
    </div>
  );
};
