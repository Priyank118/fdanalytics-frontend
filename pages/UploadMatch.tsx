
import React, { useState, useRef } from 'react';
import { Upload, Check, AlertCircle, Save, Loader2, Edit2, X, ChevronRight, Map as MapIcon, Trophy, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api';
import { PlayerStat } from '../types';
import { useNavigate } from 'react-router-dom';

export const UploadMatch: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'upload' | 'review' | 'success'>('upload');
  
  // Files
  const [summaryFile, setSummaryFile] = useState<File | null>(null);
  const [scoreboardFile, setScoreboardFile] = useState<File | null>(null);
  const [summaryPreview, setSummaryPreview] = useState<string | null>(null);
  const [scoreboardPreview, setScoreboardPreview] = useState<string | null>(null);

  // Data
  const [matchData, setMatchData] = useState<PlayerStat[]>([]);
  const [mapName, setMapName] = useState<string>("");
  const [placement, setPlacement] = useState<number>(0);
  
  // UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summaryInputRef = useRef<HTMLInputElement>(null);
  const scoreboardInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'summary' | 'scoreboard') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      if (type === 'summary') {
        setSummaryFile(file);
        setSummaryPreview(url);
      } else {
        setScoreboardFile(file);
        setScoreboardPreview(url);
      }
      setError(null);
    }
  };

  const processImages = async () => {
    if (!summaryFile || !scoreboardFile) {
      setError("Please upload both the Match Summary and the Scoreboard screenshot.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = await api.processMatchImages(summaryFile, scoreboardFile);
      setMapName(data.map);
      setPlacement(data.placement);
      setMatchData(data.players);
      setStep('review');
    } catch (err: any) {
      setError(err.message || "Failed to process images. Ensure your roster is set up in the Team page.");
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = (index: number, field: keyof PlayerStat, value: string | number) => {
    const updated = [...matchData];
    updated[index] = { ...updated[index], [field]: value };
    setMatchData(updated);
  };

  const saveMatch = async () => {
    try {
      await api.saveMatch({
        map: mapName,
        placement,
        players: matchData
      });
      setStep('success');
    } catch (e) {
      setError("Failed to save match to database.");
    }
  };

  const reset = () => {
    setSummaryFile(null);
    setScoreboardFile(null);
    setSummaryPreview(null);
    setScoreboardPreview(null);
    setMatchData([]);
    setStep('upload');
  };

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-6 animate-fade-in p-4">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 animate-bounce">
          <Check size={48} />
        </div>
        <h2 className="text-3xl font-bold text-white">Match Saved!</h2>
        <div className="flex gap-4 flex-col sm:flex-row">
           <button onClick={() => navigate('/dashboard')} className="px-6 py-3 rounded-lg font-medium text-slate-300 hover:bg-slate-800 border border-slate-700">Go to Dashboard</button>
           <button onClick={reset} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium">Upload Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Upload Match Result</h1>
        {step === 'review' && <button onClick={() => setStep('upload')} className="text-slate-400">Back</button>}
      </div>

      {step === 'upload' && (
        <div className="space-y-8">
           <div className="grid md:grid-cols-2 gap-6">
              {/* Card 1: Match Summary */}
              <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                     <h3 className="font-semibold text-white">Match Summary</h3>
                  </div>
                  <div 
                    onClick={() => summaryInputRef.current?.click()}
                    className={`h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden ${summaryFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 hover:bg-slate-800'}`}
                  >
                     <input type="file" ref={summaryInputRef} onChange={(e) => handleFileChange(e, 'summary')} accept="image/*" className="hidden" />
                     {summaryPreview ? (
                       <img src={summaryPreview} className="w-full h-full object-cover" />
                     ) : (
                       <div className="text-center text-slate-500">
                          <MapIcon size={32} className="mx-auto mb-2 opacity-50"/>
                          <p>Upload placement screen</p>
                          <p className="text-xs mt-1">Extracts: Map, Rank</p>
                       </div>
                     )}
                  </div>
              </div>

              {/* Card 2: Scoreboard */}
              <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                     <h3 className="font-semibold text-white">Team Scoreboard</h3>
                  </div>
                  <div 
                    onClick={() => scoreboardInputRef.current?.click()}
                    className={`h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden ${scoreboardFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 hover:bg-slate-800'}`}
                  >
                     <input type="file" ref={scoreboardInputRef} onChange={(e) => handleFileChange(e, 'scoreboard')} accept="image/*" className="hidden" />
                     {scoreboardPreview ? (
                       <img src={scoreboardPreview} className="w-full h-full object-cover" />
                     ) : (
                       <div className="text-center text-slate-500">
                          <ImageIcon size={32} className="mx-auto mb-2 opacity-50"/>
                          <p>Upload full scoreboard</p>
                          <p className="text-xs mt-1">Extracts: Kills, Damage, Stats</p>
                       </div>
                     )}
                  </div>
              </div>
           </div>

           {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-3">
                <AlertCircle size={20} /> <p>{error}</p>
              </div>
            )}

           <button
              onClick={processImages}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                loading 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:scale-[1.01] text-white'
              }`}
            >
              {loading ? <><Loader2 className="animate-spin" /> Analyzing (this may take up to 60s)...</> : <>Process Match Results <ChevronRight size={20}/></>}
            </button>
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-6">
           <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-panel p-4 rounded-xl">
                 <label className="text-xs text-slate-400 uppercase font-bold">Map</label>
                 <input 
                   value={mapName} 
                   onChange={(e) => setMapName(e.target.value)}
                   className="w-full bg-transparent border-b border-slate-700 text-xl font-bold text-white focus:border-primary-500 outline-none mt-1"
                 />
              </div>
              <div className="glass-panel p-4 rounded-xl">
                 <label className="text-xs text-slate-400 uppercase font-bold">Team Placement</label>
                 <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-bold text-yellow-500">#</span>
                    <input 
                      type="number"
                      value={placement} 
                      onChange={(e) => setPlacement(parseInt(e.target.value))}
                      className="w-full bg-transparent border-b border-slate-700 text-xl font-bold text-white focus:border-primary-500 outline-none"
                    />
                 </div>
              </div>
           </div>

           <div className="glass-panel border border-slate-700 rounded-xl overflow-hidden">
             <div className="px-4 py-3 md:px-6 md:py-4 bg-slate-800/50 flex justify-between items-center">
                <h3 className="font-semibold text-white">Verified Player Stats</h3>
                <span className="text-xs text-slate-400">Verify against screenshot</span>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-slate-400 min-w-[600px]">
                 <thead className="bg-slate-900/50 uppercase font-semibold text-xs">
                   <tr>
                     <th className="px-4 py-3 md:px-6 md:py-4">Player</th>
                     <th className="px-4 py-3 md:px-4 md:py-4">Kills</th>
                     <th className="px-4 py-3 md:px-4 md:py-4">Assists</th>
                     <th className="px-4 py-3 md:px-4 md:py-4">Damage</th>
                     <th className="px-4 py-3 md:px-4 md:py-4">Survival</th>
                     <th className="px-4 py-3 md:px-4 md:py-4">Revives</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-700/50">
                   {matchData.map((player, idx) => (
                     <tr key={idx} className="hover:bg-slate-700/30">
                       <td className="px-4 py-3">
                         <input value={player.name} onChange={(e) => handleDataChange(idx, 'name', e.target.value)} className="bg-transparent text-white font-medium w-full outline-none" />
                       </td>
                       <td className="px-4 py-3"><input type="number" value={player.kills} onChange={(e) => handleDataChange(idx, 'kills', parseInt(e.target.value))} className="bg-transparent text-white w-16 outline-none" /></td>
                       <td className="px-4 py-3"><input type="number" value={player.assists} onChange={(e) => handleDataChange(idx, 'assists', parseInt(e.target.value))} className="bg-transparent text-white w-16 outline-none" /></td>
                       <td className="px-4 py-3"><input type="number" value={player.damage} onChange={(e) => handleDataChange(idx, 'damage', parseInt(e.target.value))} className="bg-transparent text-white w-20 outline-none" /></td>
                       <td className="px-4 py-3"><input value={player.survivalTime} onChange={(e) => handleDataChange(idx, 'survivalTime', e.target.value)} className="bg-transparent text-white w-20 outline-none" /></td>
                       <td className="px-4 py-3"><input type="number" value={player.revives} onChange={(e) => handleDataChange(idx, 'revives', parseInt(e.target.value))} className="bg-transparent text-white w-16 outline-none" /></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>

           <div className="flex justify-end gap-4">
              <button onClick={saveMatch} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg">
                 <Save size={20} /> Save Match Data
              </button>
           </div>
        </div>
      )}
    </div>
  );
};
