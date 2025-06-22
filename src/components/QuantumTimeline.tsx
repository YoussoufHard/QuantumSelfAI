import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Star, Crown, Trophy, Heart, Zap, Sparkles } from 'lucide-react';

interface QuantumTimelineProps {
  versions: any[];
  onVersionSelect: (version: any) => void;
  className?: string;
}

const QuantumTimeline: React.FC<QuantumTimelineProps> = ({ 
  versions, 
  onVersionSelect, 
  className = '' 
}) => {
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const [hoveredVersion, setHoveredVersion] = useState<string | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'past': return Star;
      case 'present': return Zap;
      case 'future': return Crown;
      case 'parallel': return Sparkles;
      default: return Heart;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'past': return 'from-blue-500 to-cyan-500';
      case 'present': return 'from-emerald-500 to-teal-500';
      case 'future': return 'from-amber-500 to-orange-500';
      case 'parallel': return 'from-purple-500 to-pink-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getPosition = (version: any, index: number) => {
    // Positionnement sur une timeline circulaire
    const angle = (index / versions.length) * 2 * Math.PI - Math.PI / 2;
    const radius = 120;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  const handleVersionClick = (version: any) => {
    setSelectedVersion(version);
    onVersionSelect(version);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Timeline circulaire */}
      <div className="relative w-80 h-80 mx-auto">
        {/* Cercle central */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Clock className="w-8 h-8 text-white" />
        </motion.div>

        {/* Lignes de connexion */}
        {versions.map((version, index) => {
          const position = getPosition(version, index);
          return (
            <motion.line
              key={`line-${version.id}`}
              className="absolute top-1/2 left-1/2 origin-center"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 1, delay: index * 0.2 }}
              style={{
                transform: `translate(-50%, -50%) rotate(${Math.atan2(position.y, position.x)}rad)`,
                width: '120px',
                height: '2px',
                background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.5), transparent)',
              }}
            />
          );
        })}

        {/* Versions sur la timeline */}
        {versions.map((version, index) => {
          const position = getPosition(version, index);
          const Icon = getIcon(version.type);
          const isHovered = hoveredVersion === version.id;
          const isSelected = selectedVersion?.id === version.id;

          return (
            <motion.div
              key={version.id}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                x: position.x,
                y: position.y,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onHoverStart={() => setHoveredVersion(version.id)}
              onHoverEnd={() => setHoveredVersion(null)}
              onClick={() => handleVersionClick(version)}
            >
              <div className={`relative w-16 h-16 bg-gradient-to-br ${getColor(version.type)} rounded-full flex items-center justify-center shadow-lg ${
                isSelected ? 'ring-4 ring-cyan-400' : ''
              }`}>
                <Icon className="w-8 h-8 text-white" />
                
                {/* Effet de pulsation pour la version sélectionnée */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 bg-cyan-400 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </div>

              {/* Tooltip au survol */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur rounded-lg p-3 text-center min-w-max z-10"
                  >
                    <div className="text-white font-medium text-sm">{version.name}</div>
                    <div className="text-slate-300 text-xs">{version.age} ans</div>
                    <div className="text-cyan-400 text-xs">
                      {Math.round(version.compatibility || 85)}% compatible
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Particules d'ambiance */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 300],
              y: [0, (Math.random() - 0.5) * 300],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Informations de la version sélectionnée */}
      <AnimatePresence>
        {selectedVersion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur rounded-xl p-6 border border-cyan-500/30"
          >
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                {selectedVersion.name}
              </h3>
              <p className="text-slate-300 mb-4">
                {selectedVersion.preview || selectedVersion.description}
              </p>
              
              <div className="flex justify-center gap-2 mb-4">
                {selectedVersion.traits?.slice(0, 4).map((trait: string, index: number) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium"
                  >
                    {trait}
                  </motion.span>
                ))}
              </div>

              <motion.button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onVersionSelect(selectedVersion)}
              >
                Commencer la conversation
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuantumTimeline;