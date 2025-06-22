import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Zap, Crown, Star, Trophy, Heart } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import toast from 'react-hot-toast';

interface QuantumVersionGeneratorProps {
  userProfile: any;
  onGenerationComplete: (versions: any[]) => void;
  className?: string;
}

const QuantumVersionGenerator: React.FC<QuantumVersionGeneratorProps> = ({
  userProfile,
  onGenerationComplete,
  className = ''
}) => {
  const [stage, setStage] = useState<'idle' | 'generating' | 'complete'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedVersions, setGeneratedVersions] = useState<any[]>([]);

  const generationSteps = [
    { name: 'Analyse du profil Gemini', icon: Brain, color: 'from-blue-500 to-cyan-500' },
    { name: 'Génération temporelle IA', icon: Zap, color: 'from-purple-500 to-pink-500' },
    { name: 'Création des personnalités', icon: Sparkles, color: 'from-amber-500 to-orange-500' },
    { name: 'Optimisation quantique', icon: Crown, color: 'from-emerald-500 to-teal-500' },
    { name: 'Finalisation Gemini', icon: Star, color: 'from-indigo-500 to-purple-500' }
  ];

  const startGeneration = async () => {
    setStage('generating');
    setCurrentStep(0);

    toast.loading('🧠 Génération Gemini AI en cours...', { id: 'gemini-generation' });

    // Simulation des étapes de génération
    for (let i = 0; i < generationSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    try {
      // Génération réelle avec Gemini AI
      const versions = await GeminiService.generateQuantumPersonalities(userProfile);
      
      // Enrichir avec des données visuelles
      const enrichedVersions = versions.map((version, index) => ({
        ...version,
        avatar: generateAvatarData(version, userProfile),
        compatibility: 85 + Math.random() * 15, // Score de compatibilité
        unlocked: index < 3, // Les 3 premières sont débloquées
        preview: generatePreviewScript(version)
      }));

      setGeneratedVersions(enrichedVersions);
      setStage('complete');
      onGenerationComplete(enrichedVersions);
      
      toast.success('✨ Personnalités Gemini générées !', { id: 'gemini-generation' });
    } catch (error) {
      console.error('Erreur génération Gemini:', error);
      toast.error('Erreur Gemini, utilisation du fallback', { id: 'gemini-generation' });
      
      // Fallback avec versions par défaut
      const defaultVersions = getDefaultVersions();
      setGeneratedVersions(defaultVersions);
      setStage('complete');
      onGenerationComplete(defaultVersions);
    }
  };

  const generateAvatarData = (version: any, userProfile: any) => ({
    baseImage: userProfile.profilePhoto || '/default-avatar.jpg',
    ageModification: version.age - (userProfile.age || 30),
    styleModifiers: version.traits,
    clothingStyle: getClothingStyle(version.type),
    backgroundTheme: getBackgroundTheme(version.type)
  });

  const generatePreviewScript = (version: any) => {
    const scripts = {
      past: `Salut ! C'est moi à ${version.age} ans. Je déborde d'énergie et j'ai tellement de rêves à réaliser !`,
      present: `Hello ! Je suis ta version optimisée. J'ai trouvé l'équilibre parfait entre ambition et sérénité.`,
      future: `Bonjour mon cher moi du passé. Avec mes ${version.age} ans d'expérience, j'ai tant de sagesse à partager.`,
      parallel: `Hey ! Dans ma réalité, j'ai pris des chemins différents. Laisse-moi te montrer ce qui est possible !`
    };
    return scripts[version.type as keyof typeof scripts] || scripts.present;
  };

  const getClothingStyle = (type: string) => {
    const styles = {
      past: 'casual-young',
      present: 'business-casual',
      future: 'elegant-mature',
      parallel: 'creative-unique'
    };
    return styles[type as keyof typeof styles] || 'casual';
  };

  const getBackgroundTheme = (type: string) => {
    const themes = {
      past: 'vibrant-youth',
      present: 'modern-office',
      future: 'serene-wisdom',
      parallel: 'alternate-reality'
    };
    return themes[type as keyof typeof themes] || 'neutral';
  };

  const getDefaultVersions = () => [
    {
      id: 'young-self',
      name: 'Toi à 16 ans',
      age: 16,
      type: 'past',
      systemPrompt: 'Tu es optimiste, curieux et plein d\'énergie.',
      traits: ['optimiste', 'curieux', 'audacieux'],
      communicationStyle: 'Enthousiaste et encourageant',
      compatibility: 92,
      unlocked: true,
      preview: 'Salut ! C\'est moi à 16 ans. Je déborde d\'énergie et j\'ai tellement de rêves !'
    },
    {
      id: 'wise-self',
      name: 'Toi à 60 ans',
      age: 60,
      type: 'future',
      systemPrompt: 'Tu es sage, patient et bienveillant.',
      traits: ['sage', 'patient', 'bienveillant'],
      communicationStyle: 'Sage et réfléchi',
      compatibility: 88,
      unlocked: true,
      preview: 'Bonjour. Avec mes 60 ans d\'expérience, j\'ai tant de sagesse à partager.'
    },
    {
      id: 'success-self',
      name: 'Toi Parallèle Success',
      age: 35,
      type: 'parallel',
      systemPrompt: 'Tu as réalisé tous tes rêves professionnels.',
      traits: ['ambitieux', 'déterminé', 'inspirant'],
      communicationStyle: 'Motivant et stratégique',
      compatibility: 95,
      unlocked: true,
      preview: 'Hey ! Dans ma réalité, j\'ai construit l\'empire de mes rêves. Laisse-moi te montrer comment !'
    }
  ];

  if (stage === 'idle') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-center ${className}`}
      >
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur rounded-xl p-8 border border-purple-500/30">
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          
          <h3 className="text-2xl font-bold text-white mb-4">
            Génération Quantique Gemini AI
          </h3>
          <p className="text-slate-300 mb-8 max-w-md mx-auto">
            Prêt à rencontrer tes versions quantiques ? Gemini AI va analyser ton profil 
            et créer 5 personnalités uniques basées sur tes données biométriques et psychologiques.
          </p>
          
          <motion.button
            onClick={startGeneration}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            Lancer la Génération Gemini
          </motion.button>
          
          <div className="mt-4 text-xs text-slate-400">
            🤖 Powered by Google Gemini AI
          </div>
        </div>
      </motion.div>
    );
  }

  if (stage === 'generating') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${className}`}
      >
        <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur rounded-xl p-8">
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">Génération Gemini en cours...</h3>
            <p className="text-slate-300">L'IA Gemini crée tes versions quantiques personnalisées</p>
          </div>

          <div className="space-y-4">
            {generationSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <motion.div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-500 ${
                    isActive ? 'bg-white/10 border border-purple-500/50' : 
                    isCompleted ? 'bg-emerald-500/10 border border-emerald-500/30' : 
                    'bg-slate-700/30'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-emerald-500' :
                    isActive ? `bg-gradient-to-r ${step.color}` : 
                    'bg-slate-600'
                  }`}>
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Star className="w-5 h-5 text-white" />
                      </motion.div>
                    ) : (
                      <Icon className={`w-5 h-5 text-white ${isActive ? 'animate-pulse' : ''}`} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className={`font-medium ${
                      isActive ? 'text-white' : 
                      isCompleted ? 'text-emerald-400' : 
                      'text-slate-400'
                    }`}>
                      {step.name}
                    </div>
                    {isActive && (
                      <motion.div
                        className="w-full bg-slate-600 rounded-full h-1 mt-2 overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className={`h-full bg-gradient-to-r ${step.color} rounded-full`}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  }

  if (stage === 'complete') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${className}`}
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Trophy className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Tes Versions Quantiques Gemini sont prêtes !
          </h3>
          <p className="text-slate-300">
            {generatedVersions.length} personnalités uniques ont été créées par Gemini AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generatedVersions.map((version, index) => (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-xl ${
                version.unlocked 
                  ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                  : 'bg-slate-800/50 border border-slate-600'
              }`}
            >
              {!version.unlocked && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Crown className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <div className="text-amber-400 font-medium">Premium</div>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Compatibilité</div>
                    <div className="text-lg font-bold text-cyan-400">
                      {Math.round(version.compatibility)}%
                    </div>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-white mb-2">{version.name}</h4>
                <p className="text-sm text-slate-300 mb-4">{version.preview}</p>
                
                <div className="flex flex-wrap gap-2">
                  {version.traits.slice(0, 3).map((trait: string, traitIndex: number) => (
                    <span
                      key={traitIndex}
                      className="px-2 py-1 bg-white/10 rounded-full text-xs text-slate-300 capitalize"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 px-4 py-2 rounded-full text-sm border border-purple-500/30">
            <Brain className="w-4 h-4" />
            <span>Généré par Google Gemini AI</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default QuantumVersionGenerator;