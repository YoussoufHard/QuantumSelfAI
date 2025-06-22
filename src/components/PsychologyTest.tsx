import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';

interface PsychologyTestProps {
  onTestComplete: (results: any) => void;
  className?: string;
}

const bigFiveQuestions = [
  {
    id: 'extraversion_1',
    category: 'extraversion',
    question: 'Je suis quelqu\'un qui aime être entouré de gens',
    reverse: false
  },
  {
    id: 'extraversion_2',
    category: 'extraversion',
    question: 'Je préfère les activités calmes et solitaires',
    reverse: true
  },
  {
    id: 'agreeableness_1',
    category: 'agreeableness',
    question: 'Je fais confiance aux autres facilement',
    reverse: false
  },
  {
    id: 'agreeableness_2',
    category: 'agreeableness',
    question: 'Je pense que les gens ont de bonnes intentions',
    reverse: false
  },
  {
    id: 'conscientiousness_1',
    category: 'conscientiousness',
    question: 'Je suis très organisé(e) dans mon travail',
    reverse: false
  },
  {
    id: 'conscientiousness_2',
    category: 'conscientiousness',
    question: 'J\'ai tendance à remettre les choses à plus tard',
    reverse: true
  },
  {
    id: 'neuroticism_1',
    category: 'neuroticism',
    question: 'Je me sens souvent anxieux(se) ou stressé(e)',
    reverse: false
  },
  {
    id: 'neuroticism_2',
    category: 'neuroticism',
    question: 'Je reste calme dans les situations difficiles',
    reverse: true
  },
  {
    id: 'openness_1',
    category: 'openness',
    question: 'J\'aime découvrir de nouvelles idées et expériences',
    reverse: false
  },
  {
    id: 'openness_2',
    category: 'openness',
    question: 'Je préfère les routines familières',
    reverse: true
  }
];

const PsychologyTest: React.FC<PsychologyTestProps> = ({ onTestComplete, className = '' }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnswer = (value: number) => {
    const question = bigFiveQuestions[currentQuestion];
    setAnswers(prev => ({
      ...prev,
      [question.id]: value
    }));

    if (currentQuestion < bigFiveQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    const categories = {
      extraversion: 0,
      agreeableness: 0,
      conscientiousness: 0,
      neuroticism: 0,
      openness: 0
    };

    const counts = {
      extraversion: 0,
      agreeableness: 0,
      conscientiousness: 0,
      neuroticism: 0,
      openness: 0
    };

    Object.entries(answers).forEach(([questionId, value]) => {
      const question = bigFiveQuestions.find(q => q.id === questionId);
      if (question) {
        const score = question.reverse ? 6 - value : value;
        categories[question.category as keyof typeof categories] += score;
        counts[question.category as keyof typeof counts]++;
      }
    });

    // Normaliser les scores (0-100)
    const normalizedResults = Object.entries(categories).reduce((acc, [key, value]) => {
      const count = counts[key as keyof typeof counts];
      acc[key] = Math.round((value / (count * 5)) * 100);
      return acc;
    }, {} as Record<string, number>);

    const personalityProfile = {
      scores: normalizedResults,
      dominantTrait: Object.entries(normalizedResults).reduce((a, b) => 
        normalizedResults[a[0]] > normalizedResults[b[0]] ? a : b
      )[0],
      description: generatePersonalityDescription(normalizedResults),
      quantumProfiles: generateQuantumProfiles(normalizedResults)
    };

    setResults(personalityProfile);
    setShowResults(true);
    onTestComplete(personalityProfile);
  };

  const generatePersonalityDescription = (scores: Record<string, number>) => {
    const traits = [];
    
    if (scores.extraversion > 70) traits.push('extraverti');
    else if (scores.extraversion < 30) traits.push('introverti');
    
    if (scores.agreeableness > 70) traits.push('bienveillant');
    if (scores.conscientiousness > 70) traits.push('organisé');
    if (scores.openness > 70) traits.push('créatif');
    if (scores.neuroticism < 30) traits.push('stable émotionnellement');

    return `Profil ${traits.join(', ')} avec une personnalité ${scores.openness > 50 ? 'ouverte' : 'traditionnelle'}.`;
  };

  const generateQuantumProfiles = (scores: Record<string, number>) => {
    return [
      {
        name: 'Passé Motivé',
        compatibility: Math.max(scores.extraversion, scores.openness),
        description: 'Version jeune et énergique'
      },
      {
        name: 'Futur Sage',
        compatibility: Math.max(scores.conscientiousness, 100 - scores.neuroticism),
        description: 'Version mature et équilibrée'
      },
      {
        name: 'Parallèle Success',
        compatibility: Math.max(scores.conscientiousness, scores.extraversion),
        description: 'Version ambitieuse et déterminée'
      }
    ];
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const traitLabels = {
    extraversion: 'Extraversion',
    agreeableness: 'Bienveillance',
    conscientiousness: 'Conscience',
    neuroticism: 'Neuroticisme',
    openness: 'Ouverture'
  };

  const traitColors = {
    extraversion: 'from-red-500 to-pink-500',
    agreeableness: 'from-green-500 to-emerald-500',
    conscientiousness: 'from-blue-500 to-cyan-500',
    neuroticism: 'from-purple-500 to-violet-500',
    openness: 'from-amber-500 to-orange-500'
  };

  if (showResults && results) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur rounded-xl p-8 ${className}`}
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <BarChart3 className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-2">Profil Psychologique</h3>
          <p className="text-slate-300">{results.description}</p>
        </div>

        {/* Radar Chart Simulation */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-white mb-4 text-center">Big Five Personality</h4>
          <div className="space-y-4">
            {Object.entries(results.scores).map(([trait, score], index) => (
              <motion.div
                key={trait}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-24 text-sm text-slate-300 text-right">
                  {traitLabels[trait as keyof typeof traitLabels]}
                </div>
                <div className="flex-1 bg-slate-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${traitColors[trait as keyof typeof traitColors]} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                <div className="w-12 text-sm text-white font-medium">
                  {score}%
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quantum Profiles Suggestions */}
        <div>
          <h4 className="text-lg font-medium text-white mb-4">Versions Quantiques Recommandées</h4>
          <div className="grid gap-3">
            {results.quantumProfiles.map((profile: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-white">{profile.name}</div>
                  <div className="text-sm text-slate-400">{profile.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Compatibilité</div>
                  <div className="text-lg font-bold text-cyan-400">{profile.compatibility}%</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  const question = bigFiveQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / bigFiveQuestions.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-800/50 backdrop-blur rounded-xl p-8 ${className}`}
    >
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">
            Question {currentQuestion + 1} sur {bigFiveQuestions.length}
          </span>
          <span className="text-sm text-slate-400">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <h3 className="text-xl font-medium text-white mb-8">
            {question.question}
          </h3>

          {/* Scale */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-slate-400 mb-4">
              <span>Pas du tout d'accord</span>
              <span>Tout à fait d'accord</span>
            </div>
            
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <motion.button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className="w-12 h-12 rounded-full border-2 border-slate-600 hover:border-purple-500 hover:bg-purple-500/20 transition-all duration-300 flex items-center justify-center text-white font-medium"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {value}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={goToPrevious}
          disabled={currentQuestion === 0}
          className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Précédent
        </button>
        
        <div className="text-sm text-slate-400">
          {Object.keys(answers).length} / {bigFiveQuestions.length} réponses
        </div>
      </div>
    </motion.div>
  );
};

export default PsychologyTest;