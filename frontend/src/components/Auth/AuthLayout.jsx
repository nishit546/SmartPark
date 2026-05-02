import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import heroCar from '../../assets/hero_car.png';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-full flex bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* Left Panel - Branding & Illustration */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden">
        {/* Dynamic Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-900"></div>
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-violet-600/20 blur-[100px]"></div>
        
        <div className="relative w-full h-full flex flex-col justify-between p-12 z-10">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <Car className="text-white" size={20} />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              SmartPark
            </span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight"
            >
              Intelligent mobility starts here.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-slate-300 font-medium leading-relaxed"
            >
              Join the future of parking. Real-time availability, secure reservations, and premium valet services—all in one seamless experience.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-12 relative rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10"></div>
              <img 
                src={heroCar} 
                alt="SmartPark Illustration" 
                className="w-full h-64 object-cover opacity-80"
              />
            </motion.div>
          </div>

          <div className="text-sm font-medium text-slate-400">
            &copy; {new Date().getFullYear()} SmartPark Technologies
          </div>
        </div>
      </div>

      {/* Right Panel - Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <Link to="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Car className="text-white" size={20} />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">SmartPark</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{title}</h2>
            <p className="text-slate-500 font-medium text-sm">{subtitle}</p>
          </div>

          {children}
        </motion.div>
      </div>

    </div>
  );
};

export default AuthLayout;
