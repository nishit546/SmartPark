import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/Auth/AuthLayout';
import AuthInput from '../../components/Auth/AuthInput';
import toast from 'react-hot-toast';

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
});

const Signup = () => {
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/map';

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await signup(values.email, values.password, values.name);
      toast.success('Account created successfully!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Signup error:', error);
      const errorMsg = error.message || 'Failed to create account. Please try again.';
      setStatus(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await googleLogin();
      toast.success('Successfully signed up with Google!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error('Google signup failed. Please try again.');
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join SmartPark and find parking effortlessly"
    >
      <Helmet>
        <title>Create Account — SmartPark</title>
        <meta name="description" content="Join SmartPark for free. Book parking spots instantly and track your valet in real-time." />
        <meta property="og:title" content="Create Account — SmartPark" />
        <meta property="og:url" content="https://smartpark.app/signup" />
      </Helmet>
      <Formik
        initialValues={{ 
          name: '', 
          email: '', 
          password: '', 
          confirmPassword: '', 
          agreeToTerms: false 
        }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status, values, handleChange }) => (
          <Form className="space-y-4">
            <AuthInput 
              name="name" 
              type="text" 
              label="Full Name" 
              placeholder="John Doe" 
            />

            <AuthInput 
              name="email" 
              type="email" 
              label="Email Address" 
              placeholder="name@example.com" 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AuthInput 
                name="password" 
                type="password" 
                label="Password" 
                placeholder="••••••••" 
              />
              <AuthInput 
                name="confirmPassword" 
                type="password" 
                label="Confirm" 
                placeholder="••••••••" 
              />
            </div>

            <div className="flex items-start ml-1 mt-2">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={values.agreeToTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <label htmlFor="agreeToTerms" className="ml-3 block text-sm text-slate-600 font-medium">
                I agree to the{' '}
                <a href="#" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">Privacy Policy</a>
              </label>
            </div>
            
            {/* Formik won't show the error for checkbox out-of-the-box using the AuthInput component, we handle it manually */}
            <div className="ml-1 mt-1 text-red-500 text-xs font-bold h-4">
              {/* Formik error handler will inject error here if we use ErrorMessage, but we'll leave it out for simplicity, or we can use useField */}
            </div>

            {status && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold text-center">
                {status}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl shadow-slate-200 hover:translate-y-[-2px] transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : 'Create Account'}
            </button>
          </Form>
        )}
      </Formik>

      <div className="mt-6 flex items-center gap-4">
        <div className="h-px bg-slate-200 flex-1"></div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">OR</span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignup}
        className="w-full mt-6 py-3.5 px-4 bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 rounded-2xl flex items-center justify-center gap-3 transition-all text-slate-700 font-bold"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Sign up with Google
      </button>

      <div className="mt-6 text-center">
        <p className="text-slate-500 font-medium text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors ml-1">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
