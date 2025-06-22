import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Home, MessageCircle, TrendingUp, Settings, Crown } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/chat', icon: MessageCircle, label: 'Conversations' },
    { path: '/insights', icon: TrendingUp, label: 'Insights' },
    { path: '/premium', icon: Crown, label: 'Premium' },
    { path: '/settings', icon: Settings, label: 'Paramètres' }
  ];

  return (
    <nav className="w-64 bg-slate-900 min-h-screen p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white">Quantum Self AI</h1>
      </div>
      
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;