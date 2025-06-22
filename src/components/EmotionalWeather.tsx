import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, Rainbow, Zap, Heart } from 'lucide-react';

interface EmotionalWeatherProps {
  className?: string;
}

const EmotionalWeather: React.FC<EmotionalWeatherProps> = ({ className = '' }) => {
  const [currentMood, setCurrentMood] = useState<'sunny' | 'cloudy' | 'stormy' | 'rainbow'>('sunny');
  const [energy, setEnergy] = useState(75);
  const [stress, setStress] = useState(30);
  const [motivation, setMotivation] = useState(80);

  useEffect(() => {
    // Simulation de changement d'humeur basé sur les métriques
    const calculateMood = () => {
      const overallScore = (energy + motivation - stress) / 2;
      
      if (overallScore > 80) return 'rainbow';
      if (overallScore > 60) return 'sunny';
      if (overallScore > 40) return 'cloudy';
      return 'stormy';
    };

    setCurrentMood(calculateMood());
  }, [energy, stress, motivation]);

  const getMoodIcon = () => {
    switch (currentMood) {
      case 'sunny': return Sun;
      case 'cloudy': return Cloud;
      case 'stormy': return CloudRain;
      case 'rainbow': return Rainbow;
      default: return Sun;
    }
  };

  const getMoodColor = () => {
    switch (currentMood) {
      case 'sunny': return 'from-yellow-400 to-orange-500';
      case 'cloudy': return 'from-gray-400 to-gray-600';
      case 'stormy': return 'from-gray-600 to-blue-800';
      case 'rainbow': return 'from-pink-400 via-purple-500 to-cyan-500';
      default: return 'from-yellow-400 to-orange-500';
    }
  };

  const getMoodMessage = () => {
    switch (currentMood) {
      case 'sunny': return 'Tu rayonnes aujourd\'hui ! ☀️';
      case 'cloudy': return 'Quelques nuages, mais ça va passer 🌤️';
      case 'stormy': return 'Temps orageux, prends soin de toi 🌧️';
      case 'rainbow': return 'Tu es dans un état optimal ! 🌈';
      default: return 'Comment te sens-tu aujourd\'hui ?';
    }
  };

  const MoodIcon = getMoodIcon();

  return (
    <div className={`bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur rounded-xl p-6 ${className}`}>
      <div className="text-center mb-6">
        <motion.div
          className={`w-16 h-16 bg-gradient-to-br ${getMoodColor()} rounded-full flex items-center justify-center mx-auto mb-4`}
          animate={{
            scale: [1, 1.1, 1],
            rotate: currentMood === 'rainbow' ? [0, 360] : [0, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <MoodIcon className="w-8 h-8 text-white" />
        </motion.div>
        
        <h3 className="text-lg font-bold text-white mb-2">Météo Émotionnelle</h3>
        <p className="text-slate-300 text-sm">{getMoodMessage()}</p>
      </div>

      {/* Métriques émotionnelles */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-slate-300">Énergie</span>
            </div>
            <span className="text-sm font-medium text-white">{energy}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${energy}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm text-slate-300">Motivation</span>
            </div>
            <span className="text-sm font-medium text-white">{motivation}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div
              className="h-full bg-gradient-to-r from-red-400 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${motivation}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">Stress</span>
            </div>
            <span className="text-sm font-medium text-white">{stress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${stress}%` }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Conseil du jour basé sur l'humeur */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20"
      >
        <h4 className="text-sm font-medium text-white mb-2">💡 Conseil Quantique</h4>
        <p className="text-xs text-slate-300">
          {currentMood === 'rainbow' && "Continue sur cette lancée ! Partage ton énergie positive avec tes versions quantiques."}
          {currentMood === 'sunny' && "Profite de cette belle énergie pour avoir une conversation inspirante avec ton futur toi."}
          {currentMood === 'cloudy' && "Parle avec ton moi sage pour retrouver de la clarté et de la perspective."}
          {currentMood === 'stormy' && "Ton moi à 16 ans pourrait t'aider à retrouver ton optimisme naturel."}
        </p>
      </motion.div>

      {/* Boutons d'ajustement rapide */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setEnergy(Math.min(100, energy + 10))}
          className="flex-1 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs font-medium hover:bg-yellow-500/30 transition-colors"
        >
          + Énergie
        </button>
        <button
          onClick={() => setStress(Math.max(0, stress - 10))}
          className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/30 transition-colors"
        >
          - Stress
        </button>
      </div>
    </div>
  );
};

export default EmotionalWeather;