import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Lightbulb, 
  MessageCircle, 
  FileText, 
  Presentation, 
  TrendingUp, 
  Users 
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/ideas', label: 'Ideas', icon: Lightbulb },
  { path: '/mentor', label: 'AI Mentor', icon: MessageCircle },
  { path: '/bmc', label: 'BMC', icon: FileText },
  { path: '/pitch', label: 'Pitch Coach', icon: Presentation },
  { path: '/funding', label: 'Funding', icon: TrendingUp },
  { path: '/recruitment', label: 'Recruitment', icon: Users },
];

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-primary-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-primary-500"
            >
              StartSmart
            </motion.div>
          </Link>
          
          <div className="hidden md:flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === path
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-300 hover:bg-primary-700 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
          
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
