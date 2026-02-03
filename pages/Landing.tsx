
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart2, Upload, Target, Shield, ChevronRight, Activity, Zap, 
  CheckCircle2, XCircle, Brain, Layout, Users, FileSpreadsheet, 
  ArrowRight, Instagram, Twitter, Github, Swords, Crosshair, Anchor, Menu, X
} from 'lucide-react';

export const Landing: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary-500/30 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20 text-lg">FD</div>
             <span className="text-xl font-bold tracking-tight">FDAnalytics</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center">
             <a href="#features" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Features</a>
             <a href="#roles" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Roles</a>
             <a href="#how-it-works" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">How it works</a>
          </div>
          <div className="hidden md:flex gap-4">
            <Link to="/login" className="text-slate-300 hover:text-white px-3 py-2 font-medium transition-colors">Login</Link>
            <Link to="/register" className="bg-white text-slate-950 hover:bg-slate-200 px-6 py-2.5 rounded-full font-bold transition-all hover:scale-105 shadow-xl shadow-white/10 text-sm flex items-center gap-2">
              Get Started <ChevronRight size={16} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300 hover:text-white p-2">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
            <div className="md:hidden bg-slate-900 border-b border-white/5 px-4 py-6 space-y-4 shadow-2xl animate-fade-in absolute w-full top-20 left-0">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white py-2 font-medium">Features</a>
                <a href="#roles" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white py-2 font-medium">Roles</a>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white py-2 font-medium">How it works</a>
                <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                    <Link to="/login" className="text-center text-slate-300 hover:text-white py-2 font-medium">Login</Link>
                    <Link to="/register" className="text-center bg-white text-slate-950 px-6 py-3 rounded-full font-bold shadow-lg shadow-white/10">Get Started</Link>
                </div>
            </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Text Content */}
          <div className="text-left space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/50 text-primary-300 text-sm font-medium backdrop-blur-sm shadow-lg shadow-primary-900/10">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              The Analytics Platform for Tier 1 Aspirants
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Turn BGMI <br />
              Screenshots into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-indigo-400 to-purple-400">Wins.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-lg leading-relaxed">
              Stop manually typing data into Excel. Upload your match result, let our AI extract the stats, and get pro-level coaching insights instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/register" className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all hover:-translate-y-1 shadow-lg shadow-primary-600/30">
                Start For Free <ArrowRight size={20} />
              </Link>
              <a href="#how-it-works" className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl text-lg font-bold border border-slate-800 transition-all">
                Learn More
              </a>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
               <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">
                        {String.fromCharCode(64+i)}
                    </div>
                  ))}
               </div>
               <p>Trusted by 100+ Scrim Grinders</p>
            </div>
          </div>

          {/* Visual: Floating UI Elements */}
          <div className="relative h-[400px] md:h-[600px] hidden lg:block perspective-1000">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen opacity-40 animate-pulse"></div>
             
             {/* Main Card */}
             <div className="absolute top-10 right-10 w-80 bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl rotate-3 z-20 backdrop-blur-xl">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Damage</div>
                        <div className="text-4xl font-black text-white">24,502</div>
                    </div>
                    <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400"><Swords size={24}/></div>
                 </div>
                 <div className="h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-xl border border-indigo-500/10 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-between px-2 pb-2 gap-1">
                        {[40, 60, 45, 80, 55, 70, 90].map((h, i) => (
                            <div key={i} style={{height: `${h}%`}} className="w-full bg-indigo-500/50 rounded-sm"></div>
                        ))}
                    </div>
                 </div>
             </div>

             {/* Secondary Card (Roster) */}
             <div className="absolute bottom-20 left-10 w-72 bg-slate-800 border border-white/10 rounded-3xl p-5 shadow-2xl -rotate-2 z-30">
                 <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                     <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold">IGL</div>
                     <div>
                         <div className="text-white font-bold">Jonathan</div>
                         <div className="text-xs text-slate-400">Team Soul</div>
                     </div>
                 </div>
                 <div className="space-y-3">
                     <div className="flex justify-between text-sm">
                         <span className="text-slate-400">Survival</span>
                         <span className="text-white font-bold">22:45 avg</span>
                     </div>
                     <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                         <div className="w-[85%] h-full bg-orange-500 rounded-full"></div>
                     </div>
                 </div>
             </div>

             {/* Notification Bubble */}
             <div className="absolute top-40 -left-10 bg-slate-900/90 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-4 shadow-xl flex items-center gap-3 z-40 animate-bounce delay-1000">
                 <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                     <CheckCircle2 size={20} />
                 </div>
                 <div>
                     <div className="text-white font-bold text-sm">Match Processed</div>
                     <div className="text-xs text-slate-400">Erangel • #1 Winner</div>
                 </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- STATS STRIP --- */}
      <div className="border-y border-white/5 bg-slate-900/30 backdrop-blur-sm">
         <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "OCR Accuracy", val: "99%", sub: "Powered by Vision AI" },
              { label: "Matches Parsed", val: "50k+", sub: "This Month" },
              { label: "Active Squads", val: "2,400", sub: "Growing Daily" },
              { label: "Data Points", val: "1M+", sub: "Analyzed" },
            ].map((stat, i) => (
              <div key={i} className="text-center group cursor-default">
                 <div className="text-3xl md:text-4xl font-black text-white mb-1 group-hover:text-primary-400 transition-colors">{stat.val}</div>
                 <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</div>
                 <div className="text-[10px] text-slate-600 font-medium">{stat.sub}</div>
              </div>
            ))}
         </div>
      </div>

      {/* --- PROBLEM VS SOLUTION --- */}
      <section className="py-20 md:py-32 bg-slate-950 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="text-center mb-16 md:mb-20">
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Stop Managing Data Like It's 1999</h2>
                  <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                      Esports is fast. Spreadsheets are slow. See why top tier underdogs are switching to FDAnalytics.
                  </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                  {/* The Old Way */}
                  <div className="bg-slate-900/50 rounded-[2.5rem] p-8 md:p-10 border border-slate-800 relative overflow-hidden group hover:border-red-900/50 transition-colors">
                      <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-500/10 rounded-full blur-[50px]"></div>
                      <div className="flex items-center gap-3 mb-8">
                          <XCircle className="text-red-500" size={32} />
                          <h3 className="text-2xl font-bold text-white">The Old Way</h3>
                      </div>
                      <ul className="space-y-6">
                          <li className="flex items-start gap-4 text-slate-400">
                              <FileSpreadsheet className="shrink-0 text-slate-600" />
                              <span>Manually typing 20 rows of K/D data after every scrim match.</span>
                          </li>
                          <li className="flex items-start gap-4 text-slate-400">
                              <Brain className="shrink-0 text-slate-600" />
                              <span>Guessing why you died early based on "feelings" not facts.</span>
                          </li>
                          <li className="flex items-start gap-4 text-slate-400">
                              <Layout className="shrink-0 text-slate-600" />
                              <span>Messy Google Sheets that break when you add a new player.</span>
                          </li>
                      </ul>
                  </div>

                  {/* The FD Way */}
                  <div className="bg-gradient-to-br from-slate-900 to-indigo-950/30 rounded-[2.5rem] p-8 md:p-10 border border-primary-500/30 relative overflow-hidden shadow-2xl shadow-primary-900/10">
                      <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-500/20 rounded-full blur-[50px]"></div>
                      <div className="flex items-center gap-3 mb-8">
                          <CheckCircle2 className="text-primary-400" size={32} />
                          <h3 className="text-2xl font-bold text-white">The FDAnalytics Way</h3>
                      </div>
                      <ul className="space-y-6">
                          <li className="flex items-start gap-4 text-slate-200">
                              <Zap className="shrink-0 text-primary-400" />
                              <span className="font-medium">Upload a screenshot - Done. AI parses everything in 3 seconds.</span>
                          </li>
                          <li className="flex items-start gap-4 text-slate-200">
                              <Activity className="shrink-0 text-primary-400" />
                              <span className="font-medium">Automated "Coach Insights" that tell you exactly who is underperforming.</span>
                          </li>
                          <li className="flex items-start gap-4 text-slate-200">
                              <Users className="shrink-0 text-primary-400" />
                              <span className="font-medium">Role-based tracking (IGL vs Fragger) for tailored improvement.</span>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-20 md:py-24 bg-slate-900/30 border-y border-white/5">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-4xl font-black text-white">From Screenshot to Strategy</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: Upload, title: "1. Upload", desc: "Take a screenshot of your match result and upload it." },
                    { icon: Brain, title: "2. AI Process", desc: "Our Vision Engine extracts kills, damage, and survival time." },
                    { icon: Target, title: "3. Improve", desc: "Get instant charts and insights on your squad's performance." }
                ].map((step, i) => (
                    <div key={i} className="relative p-8 rounded-3xl bg-slate-950 border border-white/5 hover:border-primary-500/30 transition-colors group">
                        <div className="absolute -top-6 left-8 w-12 h-12 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center text-white font-bold text-xl group-hover:bg-primary-600 transition-colors shadow-xl">
                            {i+1}
                        </div>
                        <div className="mt-6">
                            <step.icon size={32} className="text-slate-600 mb-4 group-hover:text-primary-400 transition-colors" />
                            <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* --- ROLE BASED ANALYTICS --- */}
      <section id="roles" className="py-20 md:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
               <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                   <div className="max-w-xl">
                       <h2 className="text-3xl md:text-5xl font-black text-white mb-4">We Know Every Role is Different</h2>
                       <p className="text-slate-400 text-lg">A Fragger shouldn't be judged on survival time. An IGL shouldn't be judged on KD alone. We track what matters.</p>
                   </div>
                   <Link to="/register" className="text-primary-400 font-bold hover:text-white transition-colors flex items-center gap-2">Explore Roles <ArrowRight size={16}/></Link>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {/* Card 1 */}
                   <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                       <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 mb-4">
                           <Swords size={24} />
                       </div>
                       <h3 className="text-xl font-bold text-white mb-1">Fragger</h3>
                       <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-4">Entry Specialist</p>
                       <ul className="space-y-2 text-sm text-slate-300">
                           <li className="flex gap-2">✅ First Blood %</li>
                           <li className="flex gap-2">✅ Damage / Kill Ratio</li>
                           <li className="flex gap-2">✅ Close Range Wins</li>
                       </ul>
                   </div>

                   {/* Card 2 */}
                   <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                       <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-4">
                           <Shield size={24} />
                       </div>
                       <h3 className="text-xl font-bold text-white mb-1">IGL</h3>
                       <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-4">In-Game Leader</p>
                       <ul className="space-y-2 text-sm text-slate-300">
                           <li className="flex gap-2">✅ Placement Consistency</li>
                           <li className="flex gap-2">✅ Rotation Survival</li>
                           <li className="flex gap-2">✅ Late Game Decision</li>
                       </ul>
                   </div>

                   {/* Card 3 */}
                   <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                       <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-4">
                           <Anchor size={24} />
                       </div>
                       <h3 className="text-xl font-bold text-white mb-1">Support</h3>
                       <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-4">The Backbone</p>
                       <ul className="space-y-2 text-sm text-slate-300">
                           <li className="flex gap-2">✅ Revives / Match</li>
                           <li className="flex gap-2">✅ Assist Contribution</li>
                           <li className="flex gap-2">✅ Utility Usage</li>
                       </ul>
                   </div>

                   {/* Card 4 */}
                   <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                       <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 mb-4">
                           <Crosshair size={24} />
                       </div>
                       <h3 className="text-xl font-bold text-white mb-1">Assaulter</h3>
                       <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-4">Mid Range God</p>
                       <ul className="space-y-2 text-sm text-slate-300">
                           <li className="flex gap-2">✅ Knocks Secured</li>
                           <li className="flex gap-2">✅ Headshot %</li>
                           <li className="flex gap-2">✅ Trade Efficiency</li>
                       </ul>
                   </div>
               </div>
          </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary-900/20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
          
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Ready to Dominate?</h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Join thousands of players tracking their stats and improving their game with AI-driven analytics.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register" className="bg-white text-slate-950 px-10 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-2xl shadow-white/20">
                      Join Now - It's Free
                  </Link>
              </div>
              <p className="mt-6 text-sm text-slate-500">No credit card required • Instant setup</p>
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">FD</div>
                      <span className="text-xl font-bold">FDAnalytics</span>
                  </div>
                  <p className="text-slate-400 max-w-sm mb-6">
                      The #1 analytics platform for BGMI/PUBG Mobile esports athletes. Built by gamers, for gamers.
                  </p>
                  <div className="flex gap-4">
                      <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all"><Twitter size={18}/></a>
                      <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all"><Instagram size={18}/></a>
                      <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all"><Github size={18}/></a>
                  </div>
              </div>
              
              <div>
                  <h4 className="font-bold text-white mb-6">Product</h4>
                  <ul className="space-y-3 text-sm text-slate-400">
                      <li><a href="#" className="hover:text-primary-400">Features</a></li>
                      <li><a href="#" className="hover:text-primary-400">Pricing</a></li>
                      <li><a href="#" className="hover:text-primary-400">Changelog</a></li>
                      <li><a href="#" className="hover:text-primary-400">Docs</a></li>
                  </ul>
              </div>

              <div>
                  <h4 className="font-bold text-white mb-6">Legal</h4>
                  <ul className="space-y-3 text-sm text-slate-400">
                      <li><a href="#" className="hover:text-primary-400">Privacy Policy</a></li>
                      <li><a href="#" className="hover:text-primary-400">Terms of Service</a></li>
                      <li><a href="#" className="hover:text-primary-400">Cookie Policy</a></li>
                  </ul>
              </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
              <p>&copy; 2026 FDAnalytics. All rights reserved.</p>
              <p>Designed with ❤️ for the community.</p>
          </div>
      </footer>
    </div>
  );
};
