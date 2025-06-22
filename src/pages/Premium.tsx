import React from 'react';
import { Check, Crown, Star, Zap } from 'lucide-react';
import Navigation from '../components/Navigation';

const Premium = () => {
  const plans = [
    {
      name: 'Mensuel',
      price: '19',
      period: 'mois',
      popular: false
    },
    {
      name: 'Semestriel',
      price: '89',
      period: '6 mois',
      popular: true,
      savings: 'Économise 21%'
    },
    {
      name: 'Annuel',
      price: '149',
      period: 'an',
      popular: false,
      savings: 'Économise 34%'
    }
  ];

  const freeFeatures = [
    '3 conversations par jour',
    '3 versions quantiques de base',
    'Insights simples',
    'Support communautaire'
  ];

  const premiumFeatures = [
    'Conversations illimitées',
    '12+ versions quantiques uniques',
    'Insights avancés avec IA',
    'Analyses de personnalité complètes',
    'Conversations vocales avec avatars',
    'Export et partage des conversations',
    'Coaching personnalisé quotidien',
    'Support prioritaire 24/7',
    'Accès aux nouvelles fonctionnalités',
    'Intégration calendrier et objectifs'
  ];

  const testimonials = [
    {
      name: 'Marie L.',
      role: 'Entrepreneur',
      content: 'Quantum Self AI a transformé ma façon de prendre des décisions. Les conseils de mon futur moi sont incroyables !',
      rating: 5
    },
    {
      name: 'Thomas R.',
      role: 'Étudiant',
      content: 'Parler avec mon moi à 16 ans m\'a redonné la motivation que j\'avais perdue. C\'est magique !',
      rating: 5
    },
    {
      name: 'Sophie M.',
      role: 'Coach',
      content: 'J\'utilise Quantum Self pour mes propres sessions de coaching. Les insights sont d\'une profondeur remarquable.',
      rating: 5
    }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Crown className="w-4 h-4" />
              Débloquer tout le potentiel quantique
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Passe au niveau supérieur
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Accède à toutes tes versions quantiques, conversations illimitées, 
              et des insights IA révolutionnaires pour transformer ta vie.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-16 overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Free Plan */}
              <div className="p-8 border-r border-slate-200">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Version Gratuite</h3>
                  <div className="text-4xl font-bold text-slate-600">0€</div>
                  <div className="text-slate-500">Pour toujours</div>
                </div>
                
                <ul className="space-y-4">
                  {freeFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-slate-600" />
                      </div>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Premium Plan */}
              <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 relative">
                <div className="absolute top-4 right-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Populaire
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-2">
                    <Crown className="w-6 h-6 text-amber-500" />
                    Premium
                  </h3>
                  <div className="text-4xl font-bold text-blue-600">19€</div>
                  <div className="text-slate-500">par mois</div>
                </div>
                
                <ul className="space-y-4">
                  {premiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-blue-500 shadow-lg scale-105' 
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Plus populaire
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}€</span>
                    <span className="text-slate-600">/{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="text-emerald-600 font-medium text-sm mb-6">{plan.savings}</div>
                  )}
                  
                  <button className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}>
                    {plan.popular ? 'Choisir ce plan' : 'Sélectionner'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
              Ce que disent nos utilisateurs
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-medium text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à débloquer ton potentiel quantique ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Rejoins des milliers d'utilisateurs qui transforment leur vie 
              grâce aux conversations avec leurs versions quantiques.
            </p>
            <button className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Zap className="w-5 h-5" />
              Commencer maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;