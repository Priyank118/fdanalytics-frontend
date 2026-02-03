
import React from 'react';
import { LayoutDashboard, History, UploadCloud, Users, User, LogOut, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  onLogout: () => void;
  className?: string;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout, className = "", onClose }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Match History', icon: History, path: '/history' },
    { label: 'Upload Match', icon: UploadCloud, path: '/upload' },
    { label: 'My Squad', icon: Users, path: '/team' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <aside className={`w-64 bg-slate-900 border-r border-slate-800/50 h-screen flex-col z-20 backdrop-blur-xl ${className}`}>
      <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
            FD
            </div>
            <span className="text-lg font-bold tracking-tight text-white">FDAnalytics</span>
        </div>
        {onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-white md:hidden p-1 rounded-lg hover:bg-slate-800">
                <X size={20} />
            </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20 font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50 mt-auto">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
