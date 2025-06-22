import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, TrendingUp, Target, Calendar, Zap, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import VersionCard from '../components/VersionCard';
import Navigation from '../components/Navigation';
import EmotionalWeather from '../components/EmotionalWeather';
import QuantumTimeline from '../components/QuantumTimeline';

const Dashboard = () => {
  const { user, insights, setCurrentVersion } = useApp();

  const defaultVersions = [
    {
      id: 'young-self',
      name: 'Toi à 16 ans',
      age: 16,
      type: 'past' as const,
      description: 'Plein d\'énergie et de rêves',
      color: 'blue',
      icon: 'star',
      personality: ['optimiste', 'curieux', 'audacieux'],
      compatibility: 92,
      unlocked: true,
      preview: 'Salut ! C\'est moi à 16 ans. Je déborde d\'énergie et j\'ai tellement de rêves !'
    },
    {
      id: 'present-self',
      name: 'Toi à 30 ans',
      age: 30,
      type: 'present' as const,
      description: 'Présent optimisé et équilibré',
      color: 'emerald',
      icon: 'zap',
      personality: ['équilibré', 'efficace', 'centré'],
      compatibility: 88,
      unlocked: true,
      preview: 'Hello ! Je suis ta version optimisée. J\'ai trouvé l\'équilibre parfait.'
    },
    {
      id: 'wise-self',
      name: 'Toi à 60 ans',
      age: 60,
      type: 'future' as const,
      description: 'Sage et expérimenté',
      color: 'amber',
      icon: 'crown',
      personality: ['sage', 'patient', 'bienveillant'],
      compatibility: 95,
      unlocked: true,
      preview: 'Bonjour. Avec mes 60 ans d\'expérience, j\'ai tant de sagesse à partager.'
    },
    {
      id: 'success-self',
      name: 'Toi Parallèle Success',
      age: 35,
      type: 'parallel' as const,
      description: 'Qui a réalisé tous ses rêves',
      color: 'purple',
      icon: 'trophy',
      personality: ['ambitieux', 'déterminé', 'inspirant'],
      compatibility: 90,
      unlocked: true,
      preview: 'Hey ! Dans ma réalité, j\'ai construit l\'empire de mes rêves.'
    },
    {
      id: 'zen-self',
      name: 'Toi Parallèle Zen',
      age: 40,
      type: 'parallel' as const,
      description: 'Parfaitement équilibré et serein',
      color: 'pink',
      icon: 'sparkles',
      personality: ['serein', 'harmonieux', 'épanoui'],
      compatibility: 87,
      unlocked: false,
      preview: 'Namaste. J\'ai trouvé l\'harmonie parfaite entre tous les aspects de la vie.'
    }
  ];

  const monthlyGoals = [
    { name: 'Méditation quotidienne', progress: 75, color: 'blue' },
    { name: 'Lecture 2 livres', progress: 40, color: 'emerald' },
    { name: 'Sport 3x/semaine', progress: 85, color: 'amber' },
    { name: 'Conversations quantiques', progress: 60, color: 'purple' }
  ];

  const recentInsights = [
    {
      id: '1',
      title: 'L\'importance de la patience',
      content: 'Ton moi à 60 ans te rappelle que les meilleures choses prennent du temps...',
      category: 'wisdom' as const,
      timestamp: new Date(),
      fromVersion: 'Toi à 60 ans'
    },
    {
      id: '2', 
      title: 'Saisir les opportunités',
      content: 'Ton moi à 16 ans t\'encourage à prendre plus de risques calculés...',
      category: 'motivation' as const,
      timestamp: new Date(),
      fromVersion: 'Toi à 16 ans'
    },
    {
      id: '3',
      title: 'Équilibre vie-travail',
      content: 'Ton parallèle zen partage ses secrets pour une harmonie parfaite...',
      category: 'opportunity' as const,
      timestamp: new Date(),
      fromVersion: 'Toi Parallèle Zen'
    }
  ];

  const handleVersionSelect = (version: any) => {
    setCurrentVersion(version);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="flex-1 p-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Salut {user?.name || 'Explorer'} ! 👋
          </h1>
          <p className="text-slate-600 text-lg">
            Tes versions quantiques t'attendent. Avec qui veux-tu parler aujourd'hui ?
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Timeline Quantique */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Timeline Quantique
              </h3>
              <QuantumTimeline 
                versions={defaultVersions} 
                onVersionSelect={handleVersionSelect}
              />
            </motion.div>
          </div>

          {/* Météo Émotionnelle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <EmotionalWeather />
          </motion.div>
        </div>

        {/* Daily Conversation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden"
        >
          {/* Particules d'arrière-plan */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                animate={{
                  x: [0, Math.random() * 400],
                  y: [0, Math.random() * 200],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">💬 Conversation du Jour</h3>
              <p className="text-blue-100 mb-4">
                Ta session quotidienne t'attend ! Choisis une version et commence à explorer.
              </p>
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                Commencer une conversation
              </Link>
            </div>
            <div className="hidden md:block">
              <motion.div
                className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <MessageCircle className="w-16 h-16" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Insights */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Derniers Insights
              </h3>
              <Link to="/insights" className="text-blue-600 hover:text-blue-700 font-medium">
                Voir tout
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-slate-900">{insight.title}</h4>
                    <span className="text-xs text-slate-500">{insight.fromVersion}</span>
                  </div>
                  <p className="text-slate-600 text-sm">{insight.content}</p>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      insight.category === 'wisdom' ? 'bg-amber-100 text-amber-800' :
                      insight.category === 'motivation' ? 'bg-blue-100 text-blue-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {insight.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Monthly Goals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
          >
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-emerald-600" />
              Objectifs du mois
            </h3>
            
            <div className="space-y-4">
              {monthlyGoals.map((goal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{goal.name}</span>
                    <span className="text-sm text-slate-600">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <motion.div 
                      className={`h-full rounded-full bg-gradient-to-r ${
                        goal.color === 'blue' ? 'from-blue-500 to-blue-600' :
                        goal.color === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                        goal.color === 'amber' ? 'from-amber-500 to-amber-600' :
                        'from-purple-500 to-purple-600'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Premium Upgrade */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-amber-600" />
                <span className="font-medium text-amber-800">Débloquer plus d'objectifs</span>
              </div>
              <p className="text-sm text-amber-700 mb-3">
                Accède à des objectifs personnalisés et un suivi avancé avec Premium
              </p>
              <Link
                to="/premium"
                className="inline-block bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
              >
                Passer à Premium
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-4 gap-4 mt-8"
        >
          {[
            { value: '12', label: 'Conversations ce mois', color: 'blue' },
            { value: '8', label: 'Insights reçus', color: 'emerald' },
            { value: '5', label: 'Objectifs atteints', color: 'amber' },
            { value: '23', label: 'Jours consécutifs', color: 'purple' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="bg-white rounded-lg p-4 border border-slate-200 text-center"
            >
              <div className={`text-2xl font-bold ${
                stat.color === 'blue' ? 'text-blue-600' :
                stat.color === 'emerald' ? 'text-emerald-600' :
                stat.color === 'amber' ? 'text-amber-600' :
                'text-purple-600'
              }`}>
                {stat.value}
              </div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;