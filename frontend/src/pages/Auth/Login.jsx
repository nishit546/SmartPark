import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/Auth/AuthLayout';
import AuthInput from '../../components/Auth/AuthInput';
import toast from 'react-hot-toast';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const { login, googleLogin, loginAsGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('user'); // For simulation

  const from = location.state?.from?.pathname || (role === 'admin' ? '/dashboard' : '/map');

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await login(values.email, values.password, role);
      toast.success('Successfully logged in!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.message || 'Invalid credentials. Please try again.';
      setStatus(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      toast.success('Successfully logged in with Google!');
      navigate('/map', { replace: true });
    } catch (error) {
      console.error(error);
      toast.error('Google login failed. Please try again.');
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    toast.success('Logged in as Guest!');
    navigate('/map', { replace: true });
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Enter your details to access your account"
    >
      <Helmet>
        <title>Sign In — SmartPark</title>
        <meta name="description" content="Sign in to your SmartPark account to book parking spots and track your valet in real-time." />
        <meta property="og:title" content="Sign In — SmartPark" />
        <meta property="og:url" content="https://smartpark.app/login" />
      </Helmet>
      <Formik
        initialValues={{ email: '', password: '', rememberMe: false }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-5">
            <AuthInput 
              name="email" 
              type="email" 
              label="Email Address" 
              placeholder="name@example.com" 
            />

            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label className="block text-sm font-bold text-slate-700" htmlFor="password">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <AuthInput 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                label="" // label rendered above for custom layout
              />
            </div>

            <div className="flex items-center justify-between ml-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="rememberMe" 
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-sm font-medium text-slate-600">Remember me</span>
              </label>

              {/* Role Simulation Dropdown */}
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="text-xs font-bold text-slate-500 bg-transparent border-none focus:ring-0 cursor-pointer"
              >
                <option value="user">Login as User</option>
                <option value="admin">Login as Admin</option>
              </select>
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
                  Signing In...
                </>
              ) : 'Sign In'}
            </button>
          </Form>
        )}
      </Formik>

      <div className="mt-8 flex items-center gap-4">
        <div className="h-px bg-slate-200 flex-1"></div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">OR</span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </div>

      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3.5 px-4 bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 rounded-2xl flex items-center justify-center gap-3 transition-all text-slate-700 font-bold"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <button
          type="button"
          onClick={handleGuestLogin}
          className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center justify-center transition-all text-slate-700 font-bold"
        >
          Continue as Guest
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-slate-500 font-medium text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors ml-1">
            Create account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
