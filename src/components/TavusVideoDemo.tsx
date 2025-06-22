import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Video, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const TavusVideoDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentDemo, setCurrentDemo] = useState(0);

  const demoScenarios = [
    {
      title: "Conversation avec ton futur toi",
      description: "Découvre les conseils de sagesse de ta version à 60 ans",
      personality: "Futur Sage",
      age: "60 ans",
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Motivation de ton passé",
      description: "Retrouve l'énergie et l'audace de tes 16 ans",
      personality: "Passé Motivé", 
      age: "16 ans",
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Stratégies de ton parallèle success",
      description: "Apprends des secrets de ta version qui a tout réussi",
      personality: "Parallèle Success",
      age: "35 ans", 
      color: "from-emerald-500 to-teal-600"
    }
  ];

  const currentScenario = demoScenarios[currentDemo];

  const nextDemo = () => {
    setCurrentDemo((prev) => (prev + 1) % demoScenarios.length);
    setIsPlaying(false);
  };

  return (
    <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
      {/* Video Background with Quantum Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20"
          animate={{
            x: [-100, 100, -100],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Quantum Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            animate={{
              x: [0, Math.random() * 400],
              y: [0, Math.random() * 300],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Avatar Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className={`w-48 h-48 bg-gradient-to-br ${currentScenario.color} rounded-full flex items-center justify-center relative`}
          animate={{
            scale: isPlaying ? [1, 1.05, 1] : 1,
            boxShadow: isPlaying 
              ? ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 20px rgba(59, 130, 246, 0)', '0 0 0 0 rgba(59, 130, 246, 0)']
              : '0 0 0 0 rgba(59, 130, 246, 0)'
          }}
          transition={{
            duration: 2,
            repeat: isPlaying ? Infinity : 0
          }}
        >
          {/* Avatar Face */}
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur relative overflow-hidden">
            <span className="text-4xl font-bold text-white z-10">
              {currentScenario.personality.charAt(0)}
            </span>
            
            {/* Talking Animation */}
            {isPlaying && (
              <motion.div
                className="absolute inset-0 bg-white/10 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </div>
          
          {/* Age Badge */}
          <div className="absolute -top-2 -right-2 bg-white/20 backdrop-blur rounded-full px-3 py-1">
            <span className="text-white text-sm font-bold">{currentScenario.age}</span>
          </div>
        </motion.div>
      </div>
      
      {/* Play/Pause Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border-2 border-white/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white ml-0" />
          ) : (
            <Play className="w-8 h-8 text-white ml-1" />
          )}
        </motion.button>
      </div>
      
      {/* Demo Info */}
      <div className="absolute top-4 left-4 right-4">
        <motion.div
          key={currentDemo}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 backdrop-blur rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 font-medium text-sm">Démo Tavus Avatar</span>
          </div>
          <h3 className="text-white font-bold text-lg mb-1">{currentScenario.title}</h3>
          <p className="text-slate-300 text-sm">{currentScenario.description}</p>
        </motion.div>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>
          
          <button
            onClick={nextDemo}
            className="px-4 py-2 bg-black/50 backdrop-blur rounded-lg hover:bg-black/70 transition-colors text-white text-sm font-medium"
          >
            Démo suivante
          </button>
        </div>
        
        <div className="bg-black/50 backdrop-blur rounded-lg px-3 py-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-white text-sm font-medium">
              {currentScenario.personality}
            </span>
          </div>
        </div>
      </div>
      
      {/* Progress Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {demoScenarios.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentDemo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentDemo 
                ? 'bg-cyan-400 scale-125' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
          initial={{ width: "0%" }}
          animate={{ width: isPlaying ? "100%" : "0%" }}
          transition={{ duration: isPlaying ? 30 : 0, ease: "linear" }}
        />
      </div>

      {/* Tavus Branding */}
      <div className="absolute top-4 right-4">
        <div className="bg-black/50 backdrop-blur rounded-lg px-3 py-1">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-purple-400" />
            <span className="text-white text-xs font-medium">Powered by Tavus</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TavusVideoDemo;