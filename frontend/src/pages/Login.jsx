import React from 'react';
import { Shield } from 'lucide-react';

const Login = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-1100 to-blue-1200 overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-5 blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Login Card */}
      <div className="relative max-w-lg w-full bg-slate-900/90 rounded-xl shadow-xl p-8 flex flex-col items-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="p-3 rounded-full bg-gradient-to-br from-blue-200 to-blue-800 shadow-lg mb-2">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-blue-200 mb-2">Login</h1>
          <p className="text-slate-400 text-center">
            AI-powered verification system. Protected by blockchain and machine learning.
          </p>
        </div>
        <form className="w-full flex flex-col space-y-5">
          <input 
            type="text" 
            placeholder="Email or Username" 
            className="px-5 py-3 rounded-lg bg-slate-800 text-blue-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="px-5 py-3 rounded-lg bg-slate-800 text-blue-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-lg font-semibold text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center text-slate-400 text-sm">
          Don't have an account? <a href="/signup" className="text-blue-300 hover:underline">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
