import React from 'react';
import { motion } from 'framer-motion';

const QuantumAnimation = () => {
  return (
    <div className="relative w-full h-96 overflow-hidden">
      {/* Quantum Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
          initial={{
            x: Math.random() * 800,
            y: Math.random() * 400,
            scale: 0
          }}
          animate={{
            x: Math.random() * 800,
            y: Math.random() * 400,
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
      
      {/* Temporal Waves */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
        animate={{
          x: [-100, 900],
          opacity: [0, 0.5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Central Quantum Core */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full opacity-20 blur-xl" />
      </motion.div>
      
      {/* Orbiting Elements */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`orbit-${i}`}
          className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
          style={{
            transformOrigin: `${60 + i * 30}px 0px`
          }}
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default QuantumAnimation;