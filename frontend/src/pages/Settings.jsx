import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  User, 
  Bell, 
  Lock, 
  Shield, 
  Smartphone, 
  Moon, 
  Sun,
  Globe,
  HelpCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col p-6 transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      <Helmet>
        <title>Settings — SmartPark</title>
        <meta name="description" content="Manage your SmartPark account settings, notifications, and preferences." />
      </Helmet>

      <div className="mb-8">
        <h1 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Settings</h1>
        <p className={`mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage your account preferences and system settings</p>
      </div>

      <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-2">
          <SettingsNavLink icon={<User size={18} />} label="Profile" active />
          <SettingsNavLink icon={<Bell size={18} />} label="Notifications" />
          <SettingsNavLink icon={<Lock size={18} />} label="Security" />
          <SettingsNavLink icon={<Shield size={18} />} label="Privacy" />
          <SettingsNavLink icon={<Globe size={18} />} label="Language" />
          <SettingsNavLink icon={<HelpCircle size={18} />} label="Support" />
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Section */}
          <section className={`p-8 rounded-[2rem] border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <User className="text-indigo-500" />
              Public Profile
            </h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <img 
                  src={user?.photoURL || `https://i.pravatar.cc/150?u=${user?.uid}`} 
                  alt="Avatar" 
                  className="w-20 h-20 rounded-3xl object-cover border-2 border-indigo-500/20"
                />
                <button className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-colors">
                  <Smartphone size={14} />
                </button>
              </div>
              <div>
                <h3 className="font-bold text-lg">{user?.name || 'User'}</h3>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="First Name" value={user?.name?.split(' ')[0] || ''} isDark={isDark} />
                <InputGroup label="Last Name" value={user?.name?.split(' ')[1] || ''} isDark={isDark} />
              </div>
              <InputGroup label="Email Address" value={user?.email || ''} disabled isDark={isDark} />
            </div>
          </section>

          {/* Preferences Section */}
          <section className={`p-8 rounded-[2rem] border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Smartphone className="text-indigo-500" />
              System Preferences
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">Appearance</p>
                  <p className="text-xs text-slate-500">Switch between light and dark themes</p>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    isDark 
                      ? 'bg-slate-700 text-yellow-400 border border-slate-600' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  {isDark ? 'Light' : 'Dark'}
                </button>
              </div>

              <ToggleGroup 
                label="Push Notifications" 
                description="Receive updates about your valet status" 
                defaultChecked 
                isDark={isDark} 
              />
              <ToggleGroup 
                label="Email Marketing" 
                description="Get special offers and parking discounts" 
                isDark={isDark} 
              />
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <button className={`px-6 py-3 rounded-2xl font-bold transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
              Cancel
            </button>
            <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsNavLink = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
    active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
  }`}>
    {icon}
    {label}
  </button>
);

const InputGroup = ({ label, value, disabled = false, isDark }) => (
  <div className="flex flex-col gap-1.5">
    <label className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{label}</label>
    <input 
      type="text" 
      defaultValue={value} 
      disabled={disabled}
      className={`px-4 py-3 rounded-xl border outline-none transition-all ${
        isDark 
          ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-500' 
          : 'bg-white border-slate-200 focus:border-indigo-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    />
  </div>
);

const ToggleGroup = ({ label, description, defaultChecked = false, isDark }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-bold">{label}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
      <div className={`w-11 h-6 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
    </label>
  </div>
);

export default Settings;
