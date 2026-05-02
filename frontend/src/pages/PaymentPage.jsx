import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ShieldCheck, Smartphone, CheckCircle, CreditCard, Lock } from 'lucide-react';
import { bookingService, valetService } from '../services/apiService';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Retrieve booking details from state. If someone navigates here directly, redirect to booking.
  const bookingDetails = location.state?.bookingDetails;

  if (!bookingDetails) {
    return <Navigate to="/booking" replace />;
  }

  // Generate a mock UPI QR code URL (using an open API)
  // The 'data' parameter contains the UPI URL format: upi://pay?pa=mock@upi&pn=SmartPark&am=AMOUNT
  const upiUrl = `upi://pay?pa=smartpark@okaxis&pn=SmartPark%20Valet&am=${bookingDetails.totalAmount}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}&color=0f172a`;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    // Simulate network request for payment verification
    setTimeout(async () => {
      try {
        const generatedTxnId = `TXN${Math.floor(100000000 + Math.random() * 900000000)}`;

        // 1. Update booking status to 'confirmed' in the database
        if (bookingDetails._id) {
          await bookingService.updateStatus(bookingDetails._id, { 
            status: 'confirmed', 
            transactionId: generatedTxnId 
          });

          // 2. If it's a valet booking, create a valet request record
          if (bookingDetails.zoneType === 'valet') {
            try {
              await valetService.createValetRequest(bookingDetails._id);
            } catch (valetErr) {
              console.warn('Valet request creation failed (may already exist):', valetErr.message);
            }
          }
        }

        setIsProcessing(false);
        setPaymentSuccess(true);
        
        // Redirect to receipt after showing success for a brief moment
        setTimeout(() => {
          navigate('/receipt', { 
            state: { 
              bookingDetails: {
                ...bookingDetails,
                transactionId: generatedTxnId,
                timestamp: new Date().toLocaleString()
              } 
            },
            replace: true
          });
        }, 1500);
      } catch (err) {
        console.error('Payment confirmation failed:', err);
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col p-6">
      <Helmet>
        <title>Secure Payment — SmartPark</title>
        <meta name="description" content="Complete your parking booking payment securely via UPI, GPay, PhonePe or Paytm." />
        <meta property="og:title" content="Secure Payment — SmartPark" />
        <meta property="og:url" content="https://smartpark.app/payment" />
      </Helmet>
      <div className="max-w-3xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-dark">Secure Payment</h1>
          <p className="text-neutral mt-2 flex items-center justify-center gap-2">
            <Lock size={16} /> Encrypted & Secure checkout
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* Order Summary Side */}
          <div className="bg-neutral-dark text-white p-8 md:p-10 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="text-primary" size={24} />
                Order Summary
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-white/70">Zone</span>
                  <span className="font-semibold">{bookingDetails.zoneName}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-white/70">Duration</span>
                  <span className="font-semibold">{bookingDetails.duration} hrs</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-white/70">Vehicle</span>
                  <span className="font-semibold">{bookingDetails.licensePlate}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <p className="text-white/70 text-sm mb-1">Total Amount Due</p>
              <div className="text-4xl font-bold text-accent">₹{bookingDetails.totalAmount}</div>
            </div>
          </div>

          {/* Payment Side */}
          <div className="p-8 md:p-10 flex flex-col items-center justify-center text-center relative">
            
            {paymentSuccess ? (
              <div className="flex flex-col items-center animate-in zoom-in duration-300">
                <CheckCircle size={80} className="text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-neutral-dark">Payment Successful!</h2>
                <p className="text-neutral mt-2">Generating your receipt...</p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-neutral-dark mb-2">Scan & Pay via UPI</h2>
                <p className="text-sm text-neutral mb-6">Use GPay, PhonePe, Paytm or any UPI app</p>
                
                <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm mb-6 relative">
                  {/* Decorative corners */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-xl -translate-x-1 -translate-y-1"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-xl translate-x-1 -translate-y-1"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-xl -translate-x-1 translate-y-1"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-xl translate-x-1 translate-y-1"></div>
                  
                  <img src={qrCodeUrl} alt="UPI QR Code" className="w-48 h-48 mix-blend-multiply" />
                </div>

                <div className="flex items-center gap-4 text-slate-400 mb-8 w-full">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-xs uppercase tracking-widest font-bold">OR</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <button
                  onClick={handleSimulatePayment}
                  disabled={isProcessing}
                  className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-neutral-dark font-bold rounded-xl flex items-center justify-center gap-2 transition-colors relative overflow-hidden group"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2 text-primary">
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Smartphone size={20} className="text-primary group-hover:scale-110 transition-transform" />
                      Simulate Payment Success
                    </>
                  )}
                </button>
              </>
            )}
          </div>

        </div>
        
        <div className="mt-8 flex justify-center gap-8 opacity-50 grayscale">
          {/* Mock payment partner logos */}
          <div className="flex items-center font-bold text-xl tracking-tight">G<span className="text-slate-600">Pay</span></div>
          <div className="flex items-center font-bold text-xl text-purple-600">PhonePe</div>
          <div className="flex items-center font-bold text-xl text-blue-500">Paytm</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
