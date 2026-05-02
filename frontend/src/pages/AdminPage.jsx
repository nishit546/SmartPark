import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  Car, 
  TrendingUp, 
  ShieldCheck, 
  Search, 
  Filter, 
  MoreVertical,
  Download,
  Plus,
  RefreshCcw,
  AlertCircle,
  Calendar,
  Clock,
  ChevronDown
} from 'lucide-react';
import { parkingService, bookingService, valetService } from '../services/apiService';
import { useTheme } from '../context/ThemeContext';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   cls: 'bg-amber-500/10 text-amber-500 ring-amber-500/20' },
  confirmed: { label: 'Confirmed', cls: 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20' },
  picked_up: { label: 'Picked Up', cls: 'bg-violet-500/10 text-violet-500 ring-violet-500/20' },
  parked:    { label: 'Parked',    cls: 'bg-sky-500/10 text-sky-500 ring-sky-500/20' },
  completed: { label: 'Completed', cls: 'bg-blue-500/10 text-blue-500 ring-blue-500/20' },
  cancelled: { label: 'Cancelled', cls: 'bg-rose-500/10 text-rose-500 ring-rose-500/20' },
};

const AdminPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [zones, setZones] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [zonesRes, bookingsRes] = await Promise.all([
        parkingService.getZones(),
        bookingService.getAllBookings()
      ]);
      if (zonesRes.success) setZones(zonesRes.data);
      if (bookingsRes.success) setBookings(bookingsRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(err.message || 'Failed to load data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      const response = await bookingService.updateStatus(bookingId, { status: newStatus });
      if (response.success) {
        // Optimistically update local state (instant UI feedback)
        setBookings(prev => prev.map(b => 
          b._id === bookingId ? { ...b, status: newStatus } : b
        ));
        // If it's a valet booking, update valet status too
        const booking = bookings.find(b => b._id === bookingId);
        if (booking?.zoneId?.type === 'valet') {
          await valetService.updateValetStatus(bookingId, { status: newStatus }).catch(() => {});
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (booking.licensePlate || '').toLowerCase().includes(term) ||
      (booking.userId?.displayName || '').toLowerCase().includes(term) ||
      (booking.userId?.email || '').toLowerCase().includes(term) ||
      (booking.zoneId?.name || '').toLowerCase().includes(term) ||
      booking._id.toLowerCase().includes(term);
    
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: <TrendingUp size={20} />, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Total Bookings', value: bookings.length, icon: <ShieldCheck size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Active Zones', value: zones.length, icon: <Car size={20} />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed' || b.status === 'parked').length, icon: <Users size={20} />, color: 'text-rose-500', bg: 'bg-rose-500/10' },
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
        <title>Admin Console — SmartPark</title>
        <meta name="description" content="SmartPark admin console. Manage platform-wide parking operations, bookings, and revenue." />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Admin Console</h1>
          <p className={`mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            All booking history — {bookings.length} total records
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            disabled={loading}
            className={`p-2.5 rounded-xl border transition-all disabled:opacity-50 ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-indigo-400' : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-600'}`}
            title="Refresh data"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            <Download size={16} /> Export
          </button>
          <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all">
            <Plus size={16} /> Add Zone
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-500">
          <AlertCircle size={20} />
          <p className="text-sm font-semibold">{error}</p>
          <button onClick={fetchData} className="ml-auto text-xs underline font-bold">Retry</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-3xl border shadow-sm transition-all hover:shadow-md ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{stat.label}</p>
            <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className={`rounded-[2rem] border shadow-sm overflow-hidden transition-colors ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        
        {/* Table Toolbar */}
        <div className={`p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <h2 className={`font-black text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Booking History</h2>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
              {filteredBookings.length} records
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by name, plate, zone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-xl border text-sm outline-none transition-all w-64 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-400'}`}
              />
            </div>
            {/* Status Filter */}
            <div className="relative">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`pl-4 pr-8 py-2 rounded-xl border text-sm font-bold outline-none transition-all appearance-none cursor-pointer ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="picked_up">Picked Up</option>
                <option value="parked">Parked</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`text-[10px] font-black uppercase tracking-widest border-b ${isDark ? 'bg-slate-900/40 text-slate-500 border-slate-700' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Booking ID</th>
                <th className="px-6 py-4 whitespace-nowrap">User</th>
                <th className="px-6 py-4 whitespace-nowrap">Vehicle</th>
                <th className="px-6 py-4 whitespace-nowrap">Zone</th>
                <th className="px-6 py-4 whitespace-nowrap">Booked On</th>
                <th className="px-6 py-4 whitespace-nowrap">Slot</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Amount</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700/60' : 'divide-slate-50'}`}>
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array(8).fill(0).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className={`h-5 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`} style={{ width: `${60 + Math.random()*40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <Car size={28} className="text-slate-400" />
                      </div>
                      <p className={`font-bold text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {searchTerm || filterStatus !== 'all' ? 'No bookings match your filters' : 'No bookings yet'}
                      </p>
                      <p className="text-sm text-slate-400">
                        {searchTerm || filterStatus !== 'all' ? 'Try clearing your search or filter' : 'Bookings will appear here once users start making reservations'}
                      </p>
                      {(searchTerm || filterStatus !== 'all') && (
                        <button
                          onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
                          className="mt-2 text-xs font-bold text-indigo-500 hover:text-indigo-600 underline"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const statusCfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                  const isUpdating = updatingId === booking._id;
                  return (
                    <tr key={booking._id} className={`group transition-colors ${isDark ? 'hover:bg-slate-700/40' : 'hover:bg-indigo-50/30'}`}>
                      {/* Booking ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs font-mono font-bold px-2 py-1 rounded-lg ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                          #{booking._id.slice(-8).toUpperCase()}
                        </span>
                      </td>

                      {/* User */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                            {(booking.userId?.displayName || 'G').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-sm font-bold truncate max-w-[140px] ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                              {booking.userId?.displayName || 'Guest'}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate max-w-[140px]">
                              {booking.userId?.email || 'No account'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Vehicle */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Car size={15} className="text-slate-400 flex-shrink-0" />
                          <div>
                            <p className={`text-sm font-bold font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                              {booking.licensePlate}
                            </p>
                            <p className="text-[10px] text-slate-500">{booking.duration} hr{booking.duration !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </td>

                      {/* Zone */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {booking.zoneId?.name || 'Standard'}
                        </span>
                        {booking.zoneId?.type === 'valet' && (
                          <span className="ml-2 text-[9px] font-black uppercase tracking-wider text-violet-500 bg-violet-500/10 px-1.5 py-0.5 rounded-full">
                            Valet
                          </span>
                        )}
                      </td>

                      {/* Booked On (createdAt timestamp) */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              {formatDate(booking.createdAt)}
                            </p>
                            <p className="text-[10px] text-slate-500">{formatTime(booking.createdAt)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Slot (user-entered date/time) */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-slate-400" />
                          <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              {booking.date || '—'}
                            </p>
                            <p className="text-[10px] text-slate-500">{booking.time || ''}</p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select 
                          value={booking.status}
                          onChange={(e) => handleUpdateStatus(booking._id, e.target.value)}
                          disabled={isUpdating}
                          className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg outline-none border-none ring-1 cursor-pointer transition-opacity ${isUpdating ? 'opacity-50' : ''} ${statusCfg.cls}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="picked_up">Picked Up</option>
                          <option value="parked">Parked</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && filteredBookings.length > 0 && (
          <div className={`px-6 py-4 border-t flex items-center justify-between ${isDark ? 'border-slate-700 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
            <p className="text-xs font-semibold">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </p>
            <p className="text-xs font-semibold">
              Total collected: <span className={`font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                ₹{filteredBookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0).toLocaleString('en-IN')}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
