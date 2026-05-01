import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { bookingService } from '../services/apiService';
import { useTheme } from '../context/ThemeContext';

const AnalyticsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await bookingService.getAllBookings();
        if (response.success && Array.isArray(response.data)) {
          setBookings(response.data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const totalRevenue = Array.isArray(bookings) ? bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0) : 0;
  const totalBookings = Array.isArray(bookings) ? bookings.length : 0;
  const activeUsers = Array.isArray(bookings) ? new Set(bookings.map(b => b.userId?._id)).size : 0;

  const data = [
    { name: 'Mon', revenue: 4200, bookings: 45 },
    { name: 'Tue', revenue: 3800, bookings: 38 },
    { name: 'Wed', revenue: 5600, bookings: 52 },
    { name: 'Thu', revenue: 4900, bookings: 48 },
    { name: 'Fri', revenue: 8200, bookings: 75 },
    { name: 'Sat', revenue: 12500, bookings: 110 },
    { name: 'Sun', revenue: 10800, bookings: 95 },
  ];

  const zoneDistribution = [
    { name: 'Standard', value: 45, color: '#6366f1' },
    { name: 'Premium', value: 30, color: '#8b5cf6' },
    { name: 'Valet', value: 25, color: '#f59e0b' },
  ];

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, trend: '+12.5%', isUp: true, icon: <IndianRupee size={20} />, color: 'indigo' },
    { label: 'Total Bookings', value: totalBookings, trend: '+8.2%', isUp: true, icon: <Calendar size={20} />, color: 'emerald' },
    { label: 'Active Customers', value: activeUsers, trend: '-2.4%', isUp: false, icon: <Users size={20} />, color: 'rose' },
    { label: 'Average Ticket', value: `₹${totalBookings ? Math.round(totalRevenue/totalBookings) : 0}`, trend: '+5.1%', isUp: true, icon: <TrendingUp size={20} />, color: 'amber' },
  ];

  return (
    <div className={`h-full flex flex-col p-6 lg:p-10 overflow-y-auto transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      <Helmet>
        <title>Analytics Dashboard — SmartPark</title>
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Analytics Dashboard</h1>
          <p className={`mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Platform performance and financial insights</p>
        </div>
        <div className="flex items-center gap-3">
          <button className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
            <Filter size={16} /> Last 7 Days
          </button>
          <button className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all hover:bg-slate-800">
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-3xl border shadow-sm transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-${stat.color}-500/10 text-${stat.color}-500`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-black ${stat.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trend} {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</p>
            <h3 className="text-2xl font-black">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Revenue Area Chart */}
        <div className={`p-8 rounded-[2.5rem] border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg">Revenue Overview</h3>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              <span className="text-xs font-bold text-slate-400">Current Week</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#f1f5f9',
                    borderRadius: '16px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontWeight: 'bold'
                  }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone Distribution Bar Chart */}
        <div className={`p-8 rounded-[2.5rem] border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg">Zone Performance</h3>
            <span className="text-xs font-bold text-slate-400 text-right uppercase">Efficiency Rate</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneDistribution} layout="vertical" barSize={40}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: isDark ? '#e2e8f0' : '#475569', fontSize: 12, fontWeight: 700 }}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                  {zoneDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
