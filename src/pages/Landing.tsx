import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Brain, Star, Crown, Trophy, ChevronRight, Sparkles, Zap, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthContext } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import AuthForm from '../components/AuthForm';
import QuantumParticles from '../components/QuantumParticles';
import TavusVideoDemo from '../components/TavusVideoDemo';
import TestimonialCarousel from '../components/TestimonialCarousel';
import PricingTiers from '../components/PricingTiers';
import toast from 'react-hot-toast';

const Landing = () => {
  const { t } = useTranslation();
  const { isRegistered, visitor, loading, registerEmail } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAuthForm, setShowAuthForm] = useState(false);

  const quantumVersions = [
    {
      title: t('features.past'),
      description: t('features.past') === 'Your Motivated Past'
        ? 'Rediscover the energy and optimism of your younger self. Remember why you started.'
        : 'Retrouve l\'énergie et l\'optimisme de ton moi plus jeune. Rappelle-toi pourquoi tu as commencé.',
      icon: Star,
      color: 'from-blue-500 to-blue-700',
      age: '16 years',
      traits: ['optimistic', 'curious', 'bold'],
    },
    {
      title: t('features.present'),
      description: t('features.present') === 'Your Optimized Present'
        ? 'Optimize your present with a balanced version that perfectly masters the present moment.'
        : 'Optimise ton présent avec une version équilibrée qui maîtrise parfaitement le moment présent.',
      icon: Zap,
      color: 'from-emerald-500 to-emerald-700',
      age: '30 years',
      traits: ['balanced', 'efficient', 'centered'],
    },
    {
      title: t('features.future'),
      description: t('features.future') === 'Your Wise Future'
        ? 'Receive wisdom advice from your future self who has already lived through your current challenges.'
        : 'Reçois des conseils de sagesse de ton moi futur qui a déjà vécu tes défis actuels.',
      icon: Crown,
      color: 'from-amber-500 to-amber-700',
      age: '60 years',
      traits: ['wise', 'patient', 'benevolent'],
    },
    {
      title: t('features.success'),
      description: t('features.success') === 'Your Parallel Success'
        ? 'Explore the paths to success with a version that has achieved all professional dreams.'
        : 'Explore les chemins du succès avec une version qui a réalisé tous ses rêves professionnels.',
      icon: Trophy,
      color: 'from-purple-500 to-purple-700',
      age: '35 years',
      traits: ['ambitious', 'determined', 'inspiring'],
    },
    {
      title: t('features.zen'),
      description: t('features.zen') === 'Your Parallel Zen'
        ? 'Discover perfect harmony with a version that has found the ideal work-life balance.'
        : 'Découvre l\'harmonie parfaite avec une version qui a trouvé l\'équilibre vie-travail idéal.',
      icon: Sparkles,
      color: 'from-pink-500 to-pink-700',
      age: '40 years',
      traits: ['serene', 'harmonious', 'fulfilled'],
    },
  ];

  useEffect(() => {
    if (loading || !visitor || !isRegistered) return;
    if (location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true });
    }
  }, [isRegistered, visitor, loading, navigate, location]);

  const handleAuthClick = () => {
    setShowAuthForm(true);
  };

  const handleAuthSuccess = async (email: string) => {
    console.debug(`🚀 handleAuthSuccess appelé avec email: ${email}`);
    try {
      const { exists } = await registerEmail(email);
      console.debug(`✅ registerEmail réussi, exists: ${exists}`);
      setShowAuthForm(false);
      toast.success(exists ? t('auth.welcomeBack') : t('auth.signupSuccess'), {
        id: 'auth-toast',
      });
      // La navigation est gérée par le useEffect, donc on ne fait rien ici
    } catch (error) {
      console.error('❌ Erreur dans handleAuthSuccess:', error);
      toast.error(t('auth.error'), {
        id: 'auth-error-toast',
      });
    }
  };

  const handleDemoClick = () => {
    toast(t('demo.loading'), {
      style: { background: '#fefcbf', color: '#b45309' },
    });
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <QuantumParticles />
      </div>

      <header className="relative z-10 container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Quantum Self AI</h1>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <motion.a
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              href="#features"
              className="text-slate-300 hover:text-white transition-colors"
            >
              {t('nav.features')}
            </motion.a>
            <motion.a
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              href="#demo"
              className="text-slate-300 hover:text-white transition-colors"
            >
              {t('nav.demo')}
            </motion.a>
            <motion.a
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              href="#pricing"
              className="text-slate-300 hover:text-white transition-colors"
            >
              {t('nav.pricing')}
            </motion.a>
            <LanguageSwitcher />
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onClick={handleAuthClick}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
            >
              {t('nav.start')}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={handleAuthClick}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm"
            >
              {t('nav.start')}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </header>

      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-cyan-500/30">
              <Sparkles className="w-4 h-4" />
              {t('nav.features') === 'Features' ? 'Quantum AI Revolution' : 'Révolution IA Quantique'}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            {t('hero.title')}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent block"
            >
              {t('hero.subtitle')}
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={handleAuthClick}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {t('nav.start')}
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleDemoClick}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <Play className="w-4 h-4" />
              {t('nav.demo') === 'Demo' ? 'Watch Demo' : 'Voir la démo'}
            </button>
          </motion.div>
        </div>
      </section>

      <section id="demo" className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-purple-500/30">
              <Sparkles className="w-4 h-4" />
              Powered by Tavus AI
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('nav.demo') === 'Demo' ? 'Discover the magic in action' : 'Découvre la magie en action'}
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              {t('nav.demo') === 'Demo'
                ? 'See how your quantum versions come to life with ultra-realistic AI avatars'
                : 'Vois comment tes versions quantiques prennent vie avec des avatars IA ultra-réalistes'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-xl overflow-hidden shadow-2xl"
          >
            <TavusVideoDemo />
          </motion.div>
        </div>
      </section>

      <section id="features" className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-3 border border-blue-500/30"
          >
            <Brain className="w-4 h-4 text-blue-400" />
            Powered by Gemini AI
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold text-white mb-6"
          >
            {t('features.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
          >
            {t('features.subtitle')}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quantumVersions.map((version, index) => {
            const Icon = version.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl cursor-pointer bg-gray-800/50 backdrop-blur-sm border border-gray-700/50"
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
              >
                <div className={`bg-gradient-to-br ${version.color} p-6 text-white h-full rounded-xl transition-all duration-300 group-hover:bg-opacity-90`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-gray-300">
                        {t('nav.features') === 'Features' ? 'Age' : 'Âge'}
                      </div>
                      <div className="text-lg font-bold text-white">{version.age}</div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3">{version.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">{version.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {version.traits.map((trait, traitIndex) => (
                      <motion.span
                        key={traitIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + traitIndex * 0.05 }}
                        className="px-2 py-1 bg-gray-700/50 text-gray-200 rounded-full text-xs font-medium"
                      >
                        {trait}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <TestimonialCarousel />
        </motion.div>
      </section>

      <section id="pricing" className="relative z-10 container mx-auto px-4 py-20">
        <PricingTiers />
      </section>

      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-lg rounded-xl p-10 text-center border border-blue-500/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-blue-400 rounded-xl"
              animate={{
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-purple-400 rounded-full"
              animate={{
                rotate: [-360, 0],
                scale: [1, 0.8, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('nav.features') === 'Features'
                ? 'Ready to meet all your versions?'
                : 'Prêt à rencontrer toutes les versions de votre IA ?'}
            </h2>
            <p className="text-lg text-gray-300 mb-6 max-w-xl mx-auto">
              {t('nav.features') === 'Features'
                ? 'It only takes a few minutes to set up your quantum profile and start your transformative journey.'
                : 'Il ne faut que quelques minutes pour configurer votre profil quantique et commencer votre voyage transformateur.'}
            </p>
            <button
              onClick={handleAuthClick}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-600 transition-all duration-300 hover:scale-105"
            >
              {t('nav.start')}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 bg-gray-900/30 backdrop-blur-sm border-t border-gray-800/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-white">Quantum Self</span>
          </div>

          <div className="text-center text-gray-400 space-y-2">
            <p className="text-sm">© 2025 Quantum Self AI. All rights reserved.</p>
            <p className="text-sm">{t('footer.description')}</p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gray-800/50 rounded-full px-4 py-2 text-sm border border-gray-700/30"
            >
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400">Built with</span>
              <span className="font-semibold text-blue-300">Bolt</span>
            </motion.div>
          </div>
        </div>
      </footer>

      <AuthForm
        isOpen={showAuthForm}
        onClose={() => setShowAuthForm(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Landing;