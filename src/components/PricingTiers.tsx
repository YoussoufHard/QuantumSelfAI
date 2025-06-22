import React from 'react';
import { Check, Crown, Star, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const PricingTiers = () => {
  const plans = [
    {
      name: 'Explorateur',
      price: '0',
      period: 'Gratuit',
      description: 'Découvre le potentiel quantique',
      icon: Star,
      color: 'from-slate-600 to-slate-800',
      popular: false,
      features: [
        '3 conversations par jour',
        '3 versions quantiques de base',
        'Insights simples',
        'Support communautaire',
        'Interface mobile responsive'
      ]
    },
    {
      name: 'Quantum Pro',
      price: '19',
      period: 'mois',
      description: 'L\'expérience complète',
      icon: Crown,
      color: 'from-blue-500 to-purple-600',
      popular: true,
      features: [
        'Conversations illimitées',
        '5 versions quantiques avancées',
        'Avatars vidéo Tavus',
        'Réponses vocales ElevenLabs',
        'Insights IA avancés',
        'Analytics détaillés',
        'Export PDF des conversations',
        'Support prioritaire 24/7'
      ]
    },
    {
      name: 'Quantum Elite',
      price: '49',
      period: 'mois',
      description: 'Pour les visionnaires',
      icon: Sparkles,
      color: 'from-amber-500 to-orange-600',
      popular: false,
      features: [
        'Tout de Quantum Pro',
        '10 versions quantiques uniques',
        'Coach IA proactif',
        'Communauté River exclusive',
        'Accès anticipé aux nouvelles fonctionnalités',
        'Sessions de coaching personnalisées',
        'Intégration API personnalisée',
        'Consultation stratégique mensuelle'
      ]
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-cyan-500/30"
          >
            <Zap className="w-4 h-4" />
            Intégration RevenueCat
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Choisis ton niveau quantique
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto"
          >
            Débloquer progressivement toutes les dimensions de ton potentiel
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden ${
                  plan.popular ? 'scale-105 border-cyan-400/50' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-center py-2 text-sm font-medium">
                    ⭐ Plus populaire
                  </div>
                )}
                
                <div className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mb-6 mx-auto`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-slate-400 mb-4">{plan.description}</p>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-white">{plan.price}€</span>
                      {plan.period !== 'Gratuit' && (
                        <span className="text-slate-400">/{plan.period}</span>
                      )}
                    </div>
                    {plan.period === 'Gratuit' && (
                      <div className="text-emerald-400 font-medium">Pour toujours</div>
                    )}
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <div className={`w-5 h-5 bg-gradient-to-br ${plan.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {plan.price === '0' ? 'Commencer gratuitement' : 'Choisir ce plan'}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-slate-400 text-sm">
            💳 Paiements sécurisés via RevenueCat • 🔒 Annulation à tout moment • 🎯 Garantie satisfait ou remboursé 30 jours
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingTiers;