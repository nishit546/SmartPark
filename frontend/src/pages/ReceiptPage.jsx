import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle2, MapPin, Calendar, Clock, Car, Download, ArrowRight } from 'lucide-react';

const ReceiptPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve booking details from state. If someone navigates here directly, redirect to booking.
  const bookingDetails = location.state?.bookingDetails;

  if (!bookingDetails) {
    return <Navigate to="/booking" replace />;
  }

  const isValet = bookingDetails.zoneType === 'valet';

  const handleContinue = () => {
    if (isValet) {
      navigate('/valet', { 
        state: { 
          bookingId: bookingDetails._id,
          licensePlate: bookingDetails.licensePlate,
          time: bookingDetails.time,
        } 
      });
    } else {
      navigate('/dashboard');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col p-6">
      <Helmet>
        <title>Booking Confirmed — SmartPark</title>
        <meta name="description" content="Your SmartPark booking is confirmed. Download your digital receipt and track your valet." />
        <meta property="og:title" content="Booking Confirmed — SmartPark" />
        <meta property="og:url" content="https://smartpark.app/receipt" />
      </Helmet>
      <div className="max-w-2xl mx-auto w-full">
        
        {/* Success Header */}
        <div className="text-center mb-10 animate-in slide-in-from-bottom-4 duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-dark">Booking Confirmed!</h1>
          <p className="text-neutral mt-2">Your payment was successful and your spot is reserved.</p>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden print:shadow-none print:border-gray-300 relative">
          
          {/* Decorative receipt zig-zag top/bottom */}
          <div className="absolute top-0 left-0 w-full h-3 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDEwIDEwLDAgMjAsMTAiIGZpbGw9IiNmOGZhZmMiLz48L3N2Zz4=')] opacity-50"></div>

          <div className="p-8 md:p-10 pt-12">
            <div className="flex justify-between items-start mb-10 pb-10 border-b border-dashed border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-primary mb-1">SmartPark</h2>
                <p className="text-sm text-neutral">Digital Receipt</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono text-slate-500 mb-1">{bookingDetails.transactionId}</p>
                <p className="text-xs text-neutral">{bookingDetails.timestamp}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Service Type</p>
                  <p className="font-semibold text-neutral-dark flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    {bookingDetails.zoneName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Vehicle</p>
                  <p className="font-semibold text-neutral-dark flex items-center gap-2">
                    <Car size={16} className="text-primary" />
                    {bookingDetails.licensePlate}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Arrival Date</p>
                  <p className="font-semibold text-neutral-dark flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    {bookingDetails.date}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Time & Duration</p>
                  <p className="font-semibold text-neutral-dark flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    {bookingDetails.time} ({bookingDetails.duration} hrs)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-end">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Amount Paid</p>
                <p className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">Paid via UPI</p>
              </div>
              <div className="text-4xl font-bold text-neutral-dark">
                ₹{bookingDetails.totalAmount}
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 flex items-center justify-center gap-2 text-sm text-slate-500 print:hidden">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Your spot is guaranteed. Show this receipt upon arrival.
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex-1 py-4 bg-white border border-gray-200 hover:border-primary/30 hover:bg-slate-50 text-neutral-dark font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Download size={20} />
            Download Receipt
          </button>
          
          <button 
            onClick={handleContinue}
            className="flex-1 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20"
          >
            {isValet ? 'Track My Valet' : 'Go to Dashboard'}
            <ArrowRight size={20} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReceiptPage;
