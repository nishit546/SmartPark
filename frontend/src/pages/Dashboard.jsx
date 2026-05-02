import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Car,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  Calendar,
  Clock,
  MapPin,
  RefreshCcw,
  History,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { bookingService } from '../services/apiService';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   cls: 'bg-amber-500/10 text-amber-500' },
  confirmed: { label: 'Confirmed', cls: 'bg-emerald-500/10 text-emerald-500' },
  picked_up: { label: 'Picked Up', cls: 'bg-violet-500/10 text-violet-500' },
  parked:    { label: 'Parked',    cls: 'bg-sky-500/10 text-sky-500' },
  completed: { label: 'Completed', cls: 'bg-blue-500/10 text-blue-500' },
  cancelled: { label: 'Cancelled', cls: 'bg-rose-500/10 text-rose-500' },
};

const Dashboard = () => {
  const { user, mongoUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [historyGenerated, setHistoryGenerated] = useState(false);
  const [error, setError] = useState(null);

  // Initial load — fetch silently
  useEffect(() => {
    if (mongoUser?._id) {
      fetchBookings(false);
    } else {
      setLoading(false);
    }
  }, [mongoUser]);

  const fetchBookings = async (showGenerating = true) => {
    if (!mongoUser?._id) return;

    if (showGenerating) {
      setGenerating(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await bookingService.getUserBookings(mongoUser._id);
      if (response.success) {
        setRecentBookings(response.data);
        if (showGenerating) {
          setHistoryGenerated(true);
          // Reset the "generated" flash after 3s
          setTimeout(() => setHistoryGenerated(false), 3000);
        }
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Could not load booking history. Please try again.');
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  const totalSpent = recentBookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  const stats = [
    { label: 'System Capacity', value: '500', icon: <Car size={22} />, sub: 'Total Spots', color: 'text-indigo-500', bg: 'bg-indigo-500/10', trend: '+2.5%', trendUp: true },
    { label: 'Available Now', value: '142', icon: <CheckCircle2 size={22} />, sub: 'Real-time', color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '-4.1%', trendUp: false },
    { label: 'My Bookings', value: recentBookings.length, icon: <AlertCircle size={22} />, sub: 'Total reservations', color: 'text-rose-500', bg: 'bg-rose-500/10', trend: '+12%', trendUp: true },
    { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, icon: <TrendingUp size={22} />, sub: 'Net Spend', color: 'text-amber-500', bg: 'bg-amber-500/10', trend: '+8.4%', trendUp: true },
  ];

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex flex-col p-6 lg:p-10 transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      <Helmet>
        <title>Dashboard — SmartPark</title>
        <meta name="description" content="View your SmartPark dashboard. Monitor parking activity, bookings, and system performance." />
      </Helmet>

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className={`text-3xl font-black tracking-tight mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span className="text-indigo-500 font-bold">System Online</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search metrics..."
              className={`pl-12 pr-6 py-3 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 w-64 text-sm transition-all shadow-sm ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500/50' : 'bg-white border-slate-200/80 focus:border-indigo-500/50'}`}
            />
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className={`p-7 rounded-[2rem] border shadow-xl shadow-slate-200/20 flex flex-col group hover:translate-y-[-4px] transition-all duration-300 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-white/60'}`}>
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-colors group-hover:bg-indigo-500 group-hover:text-white`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${stat.trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</p>
              <h3 className={`text-4xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h3>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
        {/* Occupancy Chart */}
        <div className={`xl:col-span-2 p-8 rounded-[2.5rem] border shadow-xl shadow-slate-200/20 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-white/60'}`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Occupancy Velocity</h4>
              <p className="text-sm text-slate-500">Real-time usage vs historical peaks</p>
            </div>
            <div className="flex items-center gap-2">
              <button className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 border ${isDark ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-500 hover:text-indigo-500'}`}>
                <Filter size={14} /> Hourly
              </button>
            </div>
          </div>
          <div className="h-56 w-full flex items-end justify-between gap-3 px-2">
            {[40, 65, 45, 80, 55, 95, 70, 85, 50, 75, 90, 60].map((h, i) => (
              <div key={i} className="flex-grow group relative">
                <div
                  style={{ height: `${h}%` }}
                  className={`w-full rounded-t-xl transition-all duration-500 group-hover:opacity-80 cursor-pointer ${i === 5 ? 'bg-indigo-500' : isDark ? 'bg-slate-700/50' : 'bg-slate-200/70'}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Demand Heatmap */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-800 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-lg font-bold text-white tracking-tight">Demand Heatmap</h4>
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white">
                <Calendar size={20} />
              </div>
            </div>
            <div className="flex-grow flex items-center justify-center">
              <div className="relative">
                <div className="w-48 h-48 border-4 border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="w-32 h-32 border-4 border-white/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.8)] animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-pulse delay-700" />
              </div>
            </div>
            <div className="mt-8">
              <button
                onClick={() => navigate('/map')}
                className="w-full py-3 bg-white text-indigo-600 font-bold text-sm rounded-2xl hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Explore Live Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking History Table */}
      <div className={`rounded-[2.5rem] border shadow-xl shadow-slate-200/20 overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-white/60'}`}>
        
        {/* Table Header */}
        <div className={`p-8 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
          <div>
            <h4 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Booking History
            </h4>
            <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {recentBookings.length > 0
                ? `${recentBookings.length} booking${recentBookings.length !== 1 ? 's' : ''} · ₹${totalSpent.toLocaleString('en-IN')} total spent`
                : 'Your complete reservation history'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* "Generated" flash badge */}
            {historyGenerated && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full animate-pulse">
                <Sparkles size={13} />
                History loaded!
              </span>
            )}

            {/* Generate History Button */}
            <button
              onClick={() => fetchBookings(true)}
              disabled={generating}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/60 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
            >
              {generating ? (
                <>
                  <RefreshCcw size={14} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <History size={14} />
                  Generate History
                </>
              )}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`text-[10px] font-black uppercase tracking-widest border-b ${isDark ? 'bg-slate-900/40 text-slate-500 border-slate-700' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
              <tr>
                <th className="px-8 py-5 whitespace-nowrap">Booking ID</th>
                <th className="px-8 py-5 whitespace-nowrap">Vehicle</th>
                <th className="px-8 py-5 whitespace-nowrap">Zone</th>
                <th className="px-8 py-5 whitespace-nowrap">Date & Slot</th>
                <th className="px-8 py-5 whitespace-nowrap">Duration</th>
                <th className="px-8 py-5 whitespace-nowrap">Status</th>
                <th className="px-8 py-5 whitespace-nowrap text-right">Amount</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700/60' : 'divide-slate-50'}`}>
              {loading || generating ? (
                Array(4).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array(7).fill(0).map((_, j) => (
                      <td key={j} className="px-8 py-5">
                        <div className={`h-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`} style={{ width: `${50 + Math.random() * 40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan="7" className="px-8 py-14 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                        <AlertCircle size={24} className="text-rose-500" />
                      </div>
                      <p className="font-bold text-slate-600 dark:text-slate-300">{error}</p>
                      <button
                        onClick={() => fetchBookings(true)}
                        className="text-xs font-bold text-indigo-500 underline"
                      >
                        Try again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : recentBookings.length > 0 ? (
                recentBookings.map((booking, i) => {
                  const statusCfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                  return (
                    <tr
                      key={booking._id || i}
                      className={`group transition-all cursor-pointer ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-indigo-50/30'}`}
                    >
                      {/* Booking ID */}
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`text-xs font-mono font-bold px-2 py-1 rounded-lg ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                          #{booking._id.slice(-8).toUpperCase()}
                        </span>
                      </td>

                      {/* Vehicle */}
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                            <Car size={18} />
                          </div>
                          <div>
                            <p className={`text-sm font-bold font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                              {booking.licensePlate}
                            </p>
                            <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              Verified
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Zone */}
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-indigo-400 flex-shrink-0" />
                          <div>
                            <span className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              {booking.zoneId?.name || 'Standard Zone'}
                            </span>
                            {booking.zoneId?.type === 'valet' && (
                              <span className="ml-2 text-[9px] font-black uppercase text-violet-500 bg-violet-500/10 px-1.5 py-0.5 rounded-full">
                                Valet
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Date & Slot */}
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar size={13} className="text-slate-400 flex-shrink-0" />
                          <div>
                            <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              {booking.date || formatDate(booking.createdAt)}
                            </p>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Clock size={10} />
                              {booking.time || formatTime(booking.createdAt)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {booking.duration} hr{booking.duration !== 1 ? 's' : ''}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusCfg.cls}`}>
                          {statusCfg.label}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-8 py-5 whitespace-nowrap text-right">
                        <span className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <History size={28} className="text-slate-400" />
                      </div>
                      <p className={`font-bold text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        No booking history yet
                      </p>
                      <p className="text-sm text-slate-400 max-w-xs text-center">
                        Click <strong>Generate History</strong> to load your past reservations, or make your first booking.
                      </p>
                      <button
                        onClick={() => navigate('/booking')}
                        className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                      >
                        Make a Booking
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && !generating && recentBookings.length > 0 && (
          <div className={`px-8 py-5 border-t flex items-center justify-between ${isDark ? 'border-slate-700 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
            <p className="text-xs font-semibold">
              {recentBookings.length} booking{recentBookings.length !== 1 ? 's' : ''} found
            </p>
            <p className="text-xs font-semibold">
              Total spent:{' '}
              <span className={`font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                ₹{totalSpent.toLocaleString('en-IN')}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
