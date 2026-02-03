
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { UploadMatch } from './pages/UploadMatch';
import { MatchHistory } from './pages/History';
import { TeamPage } from './pages/Team';
import { Profile } from './pages/Profile';
import { LayoutDashboard, LogIn, UserPlus, Trophy, Swords, Target, Gamepad2, Zap } from 'lucide-react';
import { api } from './services/api';

// --- VISUAL COMPONENTS ---

const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse"></div>
    <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
  </div>
);

// --- AUTH COMPONENTS ---

const GoogleButton = () => {
  const handleGoogleLogin = async () => {
    try {
      const url = await api.getGoogleAuthUrl();
      window.location.href = url;
    } catch (e) {
      alert("Failed to initialize Google Login. Please check your network or try again.");
    }
  };

  return (
    <button 
      type="button" 
      onClick={handleGoogleLogin}
      className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-white/5 flex items-center justify-center gap-3 mb-6 transform hover:-translate-y-0.5"
    >
       <svg viewBox="0 0 24 24" className="w-5 h-5">
           <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
           <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
           <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
           <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
       </svg>
       Continue with Google
    </button>
  );
}

const AuthLayout = ({ children, title, subtitle, type = 'login' }: any) => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative font-sans selection:bg-primary-500/30">
    <GridBackground />
    
    <div className="w-full max-w-5xl grid md:grid-cols-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-fade-in">
      
      {/* Left Side: Form */}
      <div className="p-8 md:p-12 flex flex-col justify-center relative">
        <div className="mb-8">
           <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">FD</div>
              <span className="font-bold text-white text-lg group-hover:text-primary-400 transition-colors">FDAnalytics</span>
           </Link>
           <h2 className="text-3xl font-black text-white tracking-tight mb-2">{title}</h2>
           <p className="text-slate-400 font-medium">{subtitle}</p>
        </div>

        <GoogleButton />

        <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500 font-bold tracking-wider">Or with email</span></div>
        </div>

        {children}
      </div>

      {/* Right Side: Visuals */}
      <div className="hidden md:flex relative bg-slate-950/50 items-center justify-center p-12 overflow-hidden border-l border-white/5">
         {/* Background Image Effect */}
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
         <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-slate-950/90"></div>
         
         {/* Floating Elements */}
         <div className="relative z-10 w-full max-w-sm space-y-6">
             {/* Floating Card 1: Performance */}
             <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl transform translate-x-6 hover:translate-x-4 transition-transform duration-500 group">
                 <div className="flex justify-between items-center mb-3">
                     <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1"><Zap size={12}/> Performance</span>
                     <Trophy size={16} className="text-emerald-400 group-hover:scale-125 transition-transform" />
                 </div>
                 <div className="text-3xl font-black text-white mb-1">Top 1.2%</div>
                 <p className="text-xs text-slate-400">Your IGL stats are trending up this week.</p>
                 <div className="h-1 w-full bg-slate-800 rounded-full mt-3 overflow-hidden">
                    <div className="h-full w-[85%] bg-emerald-500 rounded-full"></div>
                 </div>
             </div>

             {/* Floating Card 2: Match Feed */}
             <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl transform -translate-x-6 hover:-translate-x-4 transition-transform duration-500">
                 <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                         <Swords size={20} />
                     </div>
                     <div>
                         <div className="text-sm font-bold text-white">Erangel • Winner</div>
                         <div className="text-xs text-slate-400 font-medium">14 Kills • 2400 Dmg</div>
                     </div>
                     <div className="ml-auto text-xs font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">
                         +24pts
                     </div>
                 </div>
             </div>
             
             {/* Text Content */}
             <div className="pt-12 text-center">
                 <p className="text-xl font-bold text-white leading-tight">"{type === 'login' ? 'Welcome back, Operator.' : 'Join the elite ecosystem.'}"</p>
                 <p className="text-sm text-slate-400 mt-2">Track. Analyze. Dominate.</p>
             </div>
         </div>
      </div>
    </div>
  </div>
);

const Login = ({ onLogin }: { onLogin: (setup: boolean) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Logic to catch OAuth callback token
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const setupStr = params.get('setup');
    const errorMsg = params.get('error');

    if (errorMsg) {
        setError(errorMsg.replace(/_/g, ' '));
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (token) {
       localStorage.setItem('token', token);
       const setupRequired = setupStr === 'true';
       onLogin(setupRequired);
       navigate(setupRequired ? '/team' : '/dashboard');
    }
  }, [location, onLogin, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token, setupRequired } = await api.login(email, password);
      localStorage.setItem("token", token);
      onLogin(setupRequired);
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Enter your credentials to access your dashboard." type="login">
        <form onSubmit={handleEmailLogin} className="space-y-5">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-medium flex items-center gap-2"><Zap size={14} className="fill-red-400 text-red-400" /> {error}</div>}
          
          <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-600 font-medium" 
                placeholder="operator@fdanalytics.com" 
                required 
              />
          </div>

          <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-600 font-medium" 
                placeholder="••••••••" 
                required 
              />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary-900/20 hover:shadow-primary-600/30 hover:-translate-y-0.5 mt-2">
            Login
          </button>
        </form>
        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
          Don't have an account? <Link to="/register" className="text-primary-400 hover:text-primary-300 font-bold transition-colors">Register for free</Link>
        </p>
    </AuthLayout>
  );
};

const Register = ({ onLogin }: { onLogin: (setup: boolean) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorMsg = params.get('error');
    if (errorMsg) {
        setError(errorMsg.replace(/_/g, ' '));
        window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token, setupRequired } = await api.register(email, password);
      localStorage.setItem("token", token);
      onLogin(setupRequired);
    } catch (err: any) {
      setError("Registration failed. Email might be in use.");
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join the platform for Tier 1 aspirants." type="register">
        <form onSubmit={handleRegister} className="space-y-5">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-medium flex items-center gap-2"><Zap size={14} className="fill-red-400 text-red-400" /> {error}</div>}
          
          <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-600 font-medium" 
                placeholder="operator@fdanalytics.com" 
                required 
              />
          </div>

          <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-600 font-medium" 
                placeholder="Create a strong password" 
                required 
              />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-600/30 hover:-translate-y-0.5 mt-2">
            Start Your Journey
          </button>
        </form>
        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
          Already have an account? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">Login</Link>
        </p>
    </AuthLayout>
  );
};

// --- App Structure ---

const AppLayout: React.FC<{ children: React.ReactNode; onLogout: () => void }> = ({ children, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar onLogout={onLogout} className="hidden md:flex fixed left-0 top-0" />
      
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-30 bg-black/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div 
            className={`fixed left-0 top-0 h-full w-64 bg-slate-900 shadow-2xl transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            onClick={(e) => e.stopPropagation()}
        >
             <Sidebar onLogout={onLogout} onClose={() => setMobileMenuOpen(false)} className="flex h-full w-full border-r-0" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
          {/* Mobile Header */}
          <div className="md:hidden flex-none bg-slate-900/90 backdrop-blur-md border-b border-slate-800 z-20 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">FD</div>
                <span className="font-bold text-white tracking-tight">FDAnalytics</span>
            </div>
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                <LayoutDashboard size={24} />
            </button>
          </div>

          <main className="flex-1 p-0 overflow-y-auto bg-slate-950/50 scrollbar-hide">
             {children}
          </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [needsSetup, setNeedsSetup] = useState(false);

  const handleAuthSuccess = (setupRequired: boolean) => {
      setIsAuthenticated(true);
      setNeedsSetup(setupRequired);
  };

  const handleLogout = () => {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setNeedsSetup(false);
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <Landing /> : <Navigate to="/dashboard" />} />
        
        <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleAuthSuccess} /> : <Navigate to={needsSetup ? "/team" : "/dashboard"} />} />
        <Route path="/register" element={!isAuthenticated ? <Register onLogin={handleAuthSuccess} /> : <Navigate to={needsSetup ? "/team" : "/dashboard"} />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={isAuthenticated ? <AppLayout onLogout={handleLogout}><Dashboard /></AppLayout> : <Navigate to="/login" />} />
        <Route path="/upload" element={isAuthenticated ? <AppLayout onLogout={handleLogout}><UploadMatch /></AppLayout> : <Navigate to="/login" />} />
        <Route path="/history" element={isAuthenticated ? <AppLayout onLogout={handleLogout}><MatchHistory /></AppLayout> : <Navigate to="/login" />} />
        <Route path="/team" element={isAuthenticated ? <AppLayout onLogout={handleLogout}><TeamPage /></AppLayout> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <AppLayout onLogout={handleLogout}><Profile /></AppLayout> : <Navigate to="/login" />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
