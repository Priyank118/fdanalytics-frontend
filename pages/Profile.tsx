
import React, { useEffect, useState } from 'react';
import { User, Mail, Shield, Zap, LogOut, Settings, Users, Crown, Gamepad2, Share2, Swords, Crosshair, Anchor, Edit2, Twitter, Instagram, Youtube, Save, Smartphone, SmartphoneCharging } from 'lucide-react';
import { api } from '../services/api';
import { Team, UserProfile, DashboardStats } from '../types';
import { useNavigate } from 'react-router-dom';

// --- AESTHETIC SKELETON LOADER ---
const ProfileSkeleton = () => (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-10 animate-fade-in pb-24">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
            <div className="h-10 w-48 bg-slate-800/50 rounded-xl animate-pulse"></div>
            <div className="h-10 w-32 bg-slate-800/50 rounded-xl animate-pulse"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
            {/* Left Col */}
            <div className="space-y-6">
                <div className="h-4 w-24 bg-slate-800/50 rounded animate-pulse"></div>
                
                {/* Gamer Card Skeleton */}
                <div className="relative aspect-[1.6] rounded-3xl bg-slate-800/40 border border-white/5 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-shimmer"></div>
                    <div className="absolute top-8 left-8 flex gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-700/50 animate-pulse"></div>
                        <div className="space-y-2">
                             <div className="h-6 w-32 bg-slate-700/50 rounded animate-pulse"></div>
                             <div className="h-4 w-20 bg-slate-700/50 rounded animate-pulse"></div>
                        </div>
                    </div>
                    <div className="absolute bottom-8 left-8 right-8 grid grid-cols-3 gap-4">
                        <div className="h-16 bg-black/20 rounded-xl animate-pulse"></div>
                        <div className="h-16 bg-black/20 rounded-xl animate-pulse"></div>
                        <div className="h-16 bg-black/20 rounded-xl animate-pulse"></div>
                    </div>
                </div>

                {/* Bio Skeleton */}
                <div className="h-32 rounded-3xl bg-slate-800/40 border border-white/5 animate-pulse"></div>
            </div>

            {/* Right Col */}
            <div className="space-y-6">
                 {/* Settings Skeleton */}
                 <div className="h-[400px] rounded-3xl bg-slate-800/40 border border-white/5 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-shimmer"></div>
                    <div className="p-6 space-y-6">
                        <div className="h-6 w-40 bg-slate-700/50 rounded animate-pulse"></div>
                        <div className="space-y-4">
                            <div className="h-16 bg-slate-700/20 rounded-xl animate-pulse"></div>
                            <div className="h-16 bg-slate-700/20 rounded-xl animate-pulse"></div>
                            <div className="h-16 bg-slate-700/20 rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                 </div>
                 
                 {/* Team Skeleton */}
                 <div className="h-40 rounded-3xl bg-slate-800/40 border border-white/5 animate-pulse"></div>
            </div>
        </div>
    </div>
);

export const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [team, setTeam] = useState<Team | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState<Partial<UserProfile>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [profileData, teamData, statsData] = await Promise.all([
                api.getMe(),
                api.getTeam(),
                api.getStats()
            ]);
            setProfile(profileData);
            setTeam(teamData);
            setStats(statsData);
            setFormData(profileData);
        } catch (e) {
            console.error("Failed to load profile data", e);
        }
    };

    const handleLogout = () => {
        if(confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.updateProfile(formData);
            setIsEditing(false);
            setProfile(prev => ({ ...prev!, ...formData }));
        } catch (e) {
            alert("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (!profile) return <ProfileSkeleton />;

    // Derived Stats
    const kdRatio = stats?.kdRatio || "0.00";
    const matchesPlayed = stats?.totalMatches || 0;
    // Find my role in the team
    const myPlayerEntry = team?.players.find(p => p.name.toLowerCase() === profile.username.toLowerCase());
    const myRole = myPlayerEntry?.role || "Flex";

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-10 animate-fade-in pb-24">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Identity</h1>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-xl font-bold transition-all text-sm md:text-base ${isEditing ? 'bg-slate-800 text-slate-300' : 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'}`}
                >
                    {isEditing ? <><Settings size={18}/> Cancel</> : <><Edit2 size={18}/> Edit Profile</>}
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 md:gap-10">
                
                {/* --- LEFT: GAMER CARD --- */}
                <div className="space-y-6">
                    <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider">Your Gamer Card</h3>
                    
                    {/* The Card */}
                    <div className="relative aspect-[1.6] rounded-3xl overflow-hidden shadow-2xl group transition-all duration-500 hover:rotate-1 hover:scale-[1.01] border border-white/5">
                        {/* Background Image */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1642398535287-29367d025b41?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/60 to-transparent"></div>
                        
                        {/* Content */}
                        <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-between">
                             <div className="flex justify-between items-start">
                                 <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
                                         <span className="text-xl md:text-2xl font-black text-white">{profile.username.substring(0,2).toUpperCase()}</span>
                                     </div>
                                     <div>
                                         <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter drop-shadow-lg">{profile.username}</h2>
                                         <div className="flex items-center gap-2 mt-1">
                                             <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-900 text-[10px] font-black uppercase tracking-widest">{profile.tier || "UNRANKED"}</span>
                                             <span className="text-white/80 text-xs font-medium">{team?.name || "No Team"}</span>
                                         </div>
                                     </div>
                                 </div>
                                 <div className="flex gap-2">
                                     {profile.device && (
                                         <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white" title={profile.device}>
                                             <Smartphone size={16} className="md:w-[18px] md:h-[18px]" />
                                         </div>
                                     )}
                                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white">
                                         <Gamepad2 size={16} className="md:w-[18px] md:h-[18px]" />
                                     </div>
                                 </div>
                             </div>

                             {/* Bottom Stats */}
                             <div className="grid grid-cols-3 gap-3 md:gap-4">
                                 <div className="bg-black/40 backdrop-blur-sm rounded-xl p-2 md:p-3 border border-white/10">
                                     <p className="text-[9px] md:text-[10px] text-slate-400 uppercase font-bold">Role</p>
                                     <div className="flex items-center gap-1 md:gap-2 overflow-hidden">
                                         <div className="shrink-0">
                                            {myRole === 'Fragger' ? <Swords size={14} className="text-rose-400 md:w-4 md:h-4"/> : 
                                            myRole === 'IGL' ? <Shield size={14} className="text-blue-400 md:w-4 md:h-4"/> :
                                            myRole === 'Support' ? <Anchor size={14} className="text-emerald-400 md:w-4 md:h-4"/> :
                                            <Users size={14} className="text-slate-400 md:w-4 md:h-4"/>}
                                         </div>
                                         <p className="text-sm md:text-lg font-bold text-white truncate">{myRole}</p>
                                     </div>
                                 </div>
                                 <div className="bg-black/40 backdrop-blur-sm rounded-xl p-2 md:p-3 border border-white/10">
                                     <p className="text-[9px] md:text-[10px] text-slate-400 uppercase font-bold">K/D</p>
                                     <div className="flex items-center gap-1 md:gap-2">
                                         <Crosshair size={14} className="text-emerald-400 md:w-4 md:h-4"/>
                                         <p className="text-sm md:text-lg font-bold text-white">{kdRatio}</p>
                                     </div>
                                 </div>
                                 <div className="bg-black/40 backdrop-blur-sm rounded-xl p-2 md:p-3 border border-white/10">
                                     <p className="text-[9px] md:text-[10px] text-slate-400 uppercase font-bold">Matches</p>
                                     <div className="flex items-center gap-1 md:gap-2">
                                         <Zap size={14} className="text-amber-400 md:w-4 md:h-4"/>
                                         <p className="text-sm md:text-lg font-bold text-white">{matchesPlayed}</p>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* Bio & Socials Display (Non-Edit Mode) */}
                    {!isEditing && (
                        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
                             <div>
                                 <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">About</h4>
                                 <p className="text-slate-300 leading-relaxed text-sm">{profile.bio || "No bio set. Click edit to add one."}</p>
                             </div>
                             
                             {(profile.bgmi_id || profile.device) && (
                                 <div className="flex gap-4 pt-2">
                                     {profile.bgmi_id && (
                                         <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                                             <span className="text-[10px] text-slate-500 uppercase font-bold block">BGMI ID</span>
                                             <span className="text-white font-mono font-bold text-sm">{profile.bgmi_id}</span>
                                         </div>
                                     )}
                                     {profile.device && (
                                         <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                                             <span className="text-[10px] text-slate-500 uppercase font-bold block">Device</span>
                                             <span className="text-white font-bold text-sm">{profile.device}</span>
                                         </div>
                                     )}
                                 </div>
                             )}

                             {profile.social_links && Object.values(profile.social_links).some(v => v) && (
                                 <div className="pt-2 flex gap-3">
                                     {profile.social_links.twitter && (
                                         <a href={`https://twitter.com/${profile.social_links.twitter.replace('@','')}`} target="_blank" className="p-2 bg-sky-500/10 text-sky-500 rounded-lg hover:bg-sky-500 hover:text-white transition-colors"><Twitter size={18}/></a>
                                     )}
                                     {profile.social_links.instagram && (
                                         <a href={`https://instagram.com/${profile.social_links.instagram.replace('@','')}`} target="_blank" className="p-2 bg-pink-500/10 text-pink-500 rounded-lg hover:bg-pink-500 hover:text-white transition-colors"><Instagram size={18}/></a>
                                     )}
                                     {profile.social_links.youtube && (
                                         <a href={profile.social_links.youtube} target="_blank" className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"><Youtube size={18}/></a>
                                     )}
                                 </div>
                             )}
                        </div>
                    )}
                </div>

                {/* --- RIGHT: EDIT FORM / SETTINGS --- */}
                <div className="space-y-6">
                    
                    {isEditing ? (
                        <div className="glass-panel p-6 rounded-3xl border border-white/5 animate-fade-in">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                <Edit2 size={18} className="text-primary-400" /> Edit Profile Details
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400">Display Name</label>
                                        <input 
                                            value={formData.username || ''} 
                                            onChange={e => setFormData({...formData, username: e.target.value})}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400">BGMI ID (In-Game)</label>
                                        <input 
                                            value={formData.bgmi_id || ''} 
                                            onChange={e => setFormData({...formData, bgmi_id: e.target.value})}
                                            placeholder="5123456789"
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none font-mono" 
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400">Current Tier</label>
                                        <select 
                                            value={formData.tier || ''} 
                                            onChange={e => setFormData({...formData, tier: e.target.value})}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none" 
                                        >
                                            <option value="Unranked">Unranked</option>
                                            <option value="Platinum">Platinum</option>
                                            <option value="Diamond">Diamond</option>
                                            <option value="Crown">Crown</option>
                                            <option value="Ace">Ace</option>
                                            <option value="Ace Master">Ace Master</option>
                                            <option value="Ace Dominator">Ace Dominator</option>
                                            <option value="Conqueror">Conqueror</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400">Device</label>
                                        <select 
                                            value={formData.device || ''} 
                                            onChange={e => setFormData({...formData, device: e.target.value})}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none" 
                                        >
                                            <option value="">Select Device</option>
                                            <option value="iPhone">iPhone</option>
                                            <option value="iPad">iPad</option>
                                            <option value="Android">Android Phone</option>
                                            <option value="Emulator">Emulator</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400">Bio / Tagline</label>
                                    <textarea 
                                        value={formData.bio || ''} 
                                        onChange={e => setFormData({...formData, bio: e.target.value})}
                                        rows={3}
                                        placeholder="Tell us about your playstyle..."
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none resize-none" 
                                    />
                                </div>

                                <div className="pt-2 border-t border-slate-700/50">
                                    <label className="text-xs font-bold text-slate-400 mb-2 block">Social Handles</label>
                                    <div className="grid gap-3">
                                        <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700 px-3">
                                            <Twitter size={16} className="text-slate-500" />
                                            <input 
                                                value={formData.social_links?.twitter || ''} 
                                                onChange={e => setFormData({...formData, social_links: {...formData.social_links, twitter: e.target.value}})}
                                                placeholder="@username"
                                                className="bg-transparent text-white text-sm w-full p-2 outline-none"
                                            />
                                        </div>
                                        <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700 px-3">
                                            <Instagram size={16} className="text-slate-500" />
                                            <input 
                                                value={formData.social_links?.instagram || ''} 
                                                onChange={e => setFormData({...formData, social_links: {...formData.social_links, instagram: e.target.value}})}
                                                placeholder="@username"
                                                className="bg-transparent text-white text-sm w-full p-2 outline-none"
                                            />
                                        </div>
                                        <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700 px-3">
                                            <Youtube size={16} className="text-slate-500" />
                                            <input 
                                                value={formData.social_links?.youtube || ''} 
                                                onChange={e => setFormData({...formData, social_links: {...formData.social_links, youtube: e.target.value}})}
                                                placeholder="Channel Link"
                                                className="bg-transparent text-white text-sm w-full p-2 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg mt-4 flex items-center justify-center gap-2"
                                >
                                    {saving ? "Saving..." : <><Save size={18} /> Save Changes</>}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-panel p-6 rounded-3xl border border-white/5">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                <Settings size={18} /> Account Settings
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Mail size={18} className="text-slate-400" />
                                        <div>
                                            <p className="text-sm font-bold text-white">Email Address</p>
                                            <p className="text-xs text-slate-500">{profile.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Shield size={18} className="text-slate-400" />
                                        <div>
                                            <p className="text-sm font-bold text-white">Privacy</p>
                                            <p className="text-xs text-slate-500">Public Profile is Active</p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-5 bg-emerald-600 rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-white/5">
                                <button onClick={handleLogout} className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Team Quick View */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white flex items-center gap-2"><Users size={18}/> Active Squad</h3>
                            <span className="text-xs font-bold bg-slate-800 text-white px-2 py-1 rounded">{team?.players.length || 0}/4</span>
                        </div>
                        <div className="space-y-2">
                            {team ? team.players.map((p, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl border border-white/5">
                                    <span className="text-sm font-medium text-white">{p.name}</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-500">{p.role}</span>
                                </div>
                            )) : <p className="text-slate-500 text-sm">No squad setup.</p>}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
