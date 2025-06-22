import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLISHABLE_KEY } from './api';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY || '');

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

export class StripeService {
  static async createCheckoutSession(priceId: string, userId: string): Promise<string> {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/premium?canceled=true`,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur création session Stripe');
      }

      const { sessionId } = await response.json();
      return sessionId;
    } catch (error) {
      console.error('Erreur Stripe checkout:', error);
      throw error;
    }
  }

  static async redirectToCheckout(sessionId: string): Promise<void> {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe non initialisé');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      throw error;
    }
  }

  static async getSubscriptionStatus(userId: string): Promise<any> {
    try {
      const response = await fetch(`/api/subscription-status/${userId}`);
      if (!response.ok) {
        throw new Error('Erreur récupération statut abonnement');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur statut abonnement:', error);
      return { active: false, plan: null };
    }
  }

  static getPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'monthly',
        name: 'Quantum Pro Mensuel',
        price: 19,
        interval: 'month',
        features: [
          'Conversations illimitées',
          '5 versions quantiques',
          'Avatars vidéo Tavus',
          'Réponses vocales ElevenLabs',
          'Insights IA avancés',
          'Support prioritaire'
        ]
      },
      {
        id: 'yearly',
        name: 'Quantum Pro Annuel',
        price: 149,
        interval: 'year',
        features: [
          'Tout du plan mensuel',
          'Économie de 34%',
          '10 versions quantiques',
          'Coach IA proactif',
          'Accès anticipé aux nouvelles fonctionnalités',
          'Consultation stratégique mensuelle'
        ]
      }
    ];
  }
}