import { Outlet, Link, useLocation } from 'react-router-dom';
import { Car, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import RoleBasedSidebar from './RoleBasedSidebar';

const Layout = () => {
  const { isAuthenticated, isGuest, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const isLoggedIn = isAuthenticated || isGuest;
  const isDark = theme === 'dark';

  return (
    <div className={`h-screen flex flex-col font-sans antialiased transition-colors duration-300 overflow-hidden ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'} selection:bg-indigo-100 selection:text-indigo-700`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 h-20 backdrop-blur-xl border-b z-50 flex items-center px-8 lg:px-16 transition-all duration-300 ${isDark ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/70 border-slate-200/50'}`}>
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-xl shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
            <Car className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-800 tracking-tight">
            SmartPark
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          {/* ─── Theme Toggle ─── */}
          <button
            id="theme-toggle-btn"
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthPage ? null : isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className={`text-sm font-semibold leading-none ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                    {user?.name || 'User'}
                  </span>
                  {isGuest && (
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Guest Mode</span>
                  )}
                </div>
              </div>
              <button
                onClick={logout}
                className={`ml-2 px-5 py-2.5 rounded-xl transition-all font-bold text-sm ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-100' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/" className={`text-sm font-bold transition-colors hidden md:block ${isDark ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-500 hover:text-indigo-600'}`}>Platform</Link>
              <Link to="/" className={`text-sm font-bold transition-colors hidden md:block ${isDark ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-500 hover:text-indigo-600'}`}>Pricing</Link>
              <Link to="/login" className={`text-sm font-bold transition-colors ${isDark ? 'text-slate-100 hover:text-indigo-400' : 'text-slate-900 hover:text-indigo-600'}`}>Sign In</Link>
              <Link to="/signup" className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all font-bold text-sm shadow-xl shadow-indigo-200/50 hover:translate-y-[-2px]">
                Join Now
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Content with Optional Sidebar */}
      <div className="flex flex-1 pt-20 min-h-0">
        {isLoggedIn && !isAuthPage && <RoleBasedSidebar />}
        <main className="flex-1 min-h-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Simple Footer only if not authenticated to keep app-view clean */}
      {!isLoggedIn && (
        <footer className={`py-12 px-8 lg:px-16 border-t ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className={`flex items-center gap-2 opacity-50`}>
              <Car size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">SmartPark &copy; 2026</span>
            </div>
            <div className="flex items-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
