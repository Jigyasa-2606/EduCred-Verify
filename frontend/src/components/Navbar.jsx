import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Home, Upload, User, QrCode } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Left nav items
  const leftNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/verify', label: 'Verify Certificate', icon: Upload },
    { path: '/scan', label: 'QR Code Scan', icon: QrCode },
  ];

  // Right nav items
  const rightNavItems = [
    { path: '/signup', label: 'Sign Up', icon: User },
    { path: '/login', label: 'Login', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg border-b border-blue-400/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Branding and Left nav */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/30">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span
                className="text-xl font-bold bg-gradient-to-r from-blue-300 via-blue-200 to-cyan-300 bg-clip-text text-transparent"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Authenticity Validator
              </span>
            </Link>

            {/* Desktop Left Nav */}
            <div className="hidden md:flex items-center space-x-2">
              {leftNavItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive(path)
                      ? 'text-blue-100 bg-blue-600/30 shadow-md border border-blue-400/40'
                      : 'text-slate-300 hover:text-blue-200 hover:bg-slate-700/50'
                  }`}
                >
                  <Icon size={16} className={isActive(path) ? 'text-blue-300' : 'text-slate-400'} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Right Nav */}
          <div className="hidden md:flex items-center space-x-2">
            {rightNavItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive(path)
                    ? 'text-blue-100 bg-blue-600/30 shadow-md border border-blue-400/40'
                    : 'text-slate-300 hover:text-blue-200 hover:bg-slate-700/50'
                }`}
              >
                <Icon size={16} className={isActive(path) ? 'text-blue-300' : 'text-slate-400'} />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-slate-300 hover:text-blue-200 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-fadeIn">
            <div className="px-2 pt-2 pb-4 space-y-2 border-t border-blue-400/20 bg-slate-800/80 rounded-b-lg mt-1">
              {[...leftNavItems, ...rightNavItems].map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    isActive(path)
                      ? 'text-blue-100 bg-blue-600/30 shadow-sm border border-blue-400/40'
                      : 'text-slate-300 hover:text-blue-200 hover:bg-slate-700/50'
                  }`}
                >
                  <Icon size={18} className={isActive(path) ? 'text-blue-300' : 'text-slate-400'} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
