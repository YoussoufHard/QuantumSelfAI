import React from 'react';
import { Star, Crown, Trophy, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { QuantumVersion } from '../types';

interface VersionCardProps {
  version: QuantumVersion;
  onSelect?: () => void;
  selected?: boolean;
}

const VersionCard: React.FC<VersionCardProps> = ({ version, onSelect, selected }) => {
  const getIcon = () => {
    switch (version.icon) {
      case 'star': return Star;
      case 'crown': return Crown;
      case 'trophy': return Trophy;
      case 'zap': return Zap;
      case 'sparkles': return Sparkles;
      default: return Star;
    }
  };

  const getColorClasses = () => {
    switch (version.color) {
      case 'blue': return 'from-blue-500 to-blue-700 border-blue-300';
      case 'amber': return 'from-amber-500 to-amber-700 border-amber-300';
      case 'emerald': return 'from-emerald-500 to-emerald-700 border-emerald-300';
      case 'purple': return 'from-purple-500 to-purple-700 border-purple-300';
      case 'pink': return 'from-pink-500 to-pink-700 border-pink-300';
      default: return 'from-blue-500 to-blue-700 border-blue-300';
    }
  };

  const Icon = getIcon();

  return (
    <motion.div
      onClick={onSelect}
      className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
        selected ? 'ring-4 ring-cyan-400 scale-105' : 'hover:scale-105'
      }`}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`bg-gradient-to-br ${getColorClasses()} p-6 text-white h-full relative`}>
        {/* Animated Background Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0"
          animate={{ opacity: selected ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-right">
              <div className="text-sm opacity-80">Âge</div>
              <div className="text-xl font-bold">{version.age}</div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-2">{version.name}</h3>
          <p className="text-sm opacity-90 mb-4">{version.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {version.personality.map((trait, index) => (
              <motion.span
                key={index}
                className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {trait}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
      
      {selected && (
        <motion.div
          className="absolute top-2 right-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </motion.div>
      )}
      
      {/* Quantum Particles Effect */}
      {selected && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{ 
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                opacity: 0 
              }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default VersionCard;