import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Car, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Clock,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { parkingService } from '../services/apiService';
import { useTheme } from '../context/ThemeContext';

const ManagementPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchZones = async () => {
    setLoading(true);
    try {
      const response = await parkingService.getZones();
      if (response.success) {
        setZones(response.data);
      }
    } catch (error) {
      console.error('Error fetching zones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const filteredZones = zones.filter(zone => 
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`h-full flex flex-col p-6 lg:p-10 overflow-y-auto transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      <Helmet>
        <title>Parking Management — SmartPark</title>
        <meta name="description" content="Manage parking zones, availability, and pricing." />
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Parking Management</h1>
          <p className={`mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Configure parking zones and real-time availability</p>
        </div>
        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl flex items-center gap-2 shadow-xl shadow-indigo-500/20 transition-all">
          <Plus size={18} /> Add New Zone
        </button>
      </div>

      {/* Search and Filters */}
      <div className={`p-4 rounded-[2rem] border mb-8 flex items-center gap-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by zone name or type..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-12 pr-6 py-3 rounded-2xl border outline-none transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-500'}`}
          />
        </div>
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className={`h-64 rounded-[2.5rem] animate-pulse ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}></div>
          ))
        ) : filteredZones.length > 0 ? (
          filteredZones.map((zone) => (
            <div key={zone._id} className={`group p-8 rounded-[2.5rem] border shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700 hover:border-indigo-500/50' : 'bg-white border-slate-100 hover:border-indigo-100'}`}>
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  zone.type === 'premium' ? 'bg-indigo-500/10 text-indigo-500' :
                  zone.type === 'valet' ? 'bg-amber-500/10 text-amber-500' :
                  'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {zone.type === 'valet' ? <Clock size={28} /> : zone.type === 'premium' ? <ShieldCheck size={28} /> : <Car size={28} />}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                    <Edit3 size={18} />
                  </button>
                  <button className="p-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div>
                <h3 className={`text-xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{zone.name}</h3>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{zone.type} Area</p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Availability</p>
                  <p className="text-lg font-black">{zone.availableSpots}/{zone.totalSpots}</p>
                </div>
                <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Rate</p>
                  <p className="text-lg font-black text-indigo-500">₹{zone.pricePerHour}/hr</p>
                </div>
              </div>

              <button className="w-full mt-6 py-3 rounded-xl border border-dashed border-slate-300 text-slate-400 text-xs font-bold hover:border-indigo-500 hover:text-indigo-500 transition-all flex items-center justify-center gap-2">
                Manage Sensor Grid <ChevronRight size={14} />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="inline-flex p-6 bg-slate-100 rounded-full text-slate-400 mb-6">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-400">No zones found matching your search.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagementPage;
