import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Calendar, 
  Car, 
  BarChart, 
  Settings,
  LogOut
} from 'lucide-react';

const RoleBasedSidebar = () => {
  const { userRole, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const userLinks = [
    { name: 'Map View', path: '/map', icon: <MapIcon size={20} /> },
    { name: 'Booking', path: '/booking', icon: <Calendar size={20} /> },
    { name: 'Valet Tracking', path: '/valet', icon: <Car size={20} /> },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Admin Console', path: '/admin', icon: <BarChart size={20} /> },
    { name: 'Parking Management', path: '/management', icon: <Car size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart size={20} /> },
  ];

  const links = userRole === 'admin' ? adminLinks : userLinks;

  return (
    <aside className={`w-64 border-r transition-colors duration-300 flex flex-col h-full overflow-y-auto ${isDark ? 'bg-slate-900 border-slate-700/50' : 'bg-white border-slate-200/50'}`}>
      <div className="flex-1 py-6 px-4 space-y-1">
        <p className={`px-4 text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {userRole === 'admin' ? 'Admin Tools' : 'User Menu'}
        </p>
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-500'
                  : isDark 
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-white' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </div>
      <div className={`p-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
              isActive
                ? 'bg-indigo-500/10 text-indigo-500'
                : isDark 
                  ? 'text-slate-400 hover:bg-slate-800 hover:text-white' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`
          }
        >
          <Settings size={20} />
          Settings
        </NavLink>
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-4 py-3 mt-1 rounded-xl font-semibold transition-all ${
            isDark ? 'text-red-400 hover:bg-red-950/30' : 'text-red-600 hover:bg-red-50'
          }`}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default RoleBasedSidebar;
