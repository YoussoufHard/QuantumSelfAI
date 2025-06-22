import OpenAI from 'openai';
import { OPENAI_API_KEY } from './api';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Pour le développement uniquement
});

export interface QuantumPersonality {
  id: string;
  name: string;
  age: number;
  type: 'past' | 'present' | 'future' | 'parallel';
  systemPrompt: string;
  traits: string[];
  communicationStyle: string;
}

export class OpenAIService {
  static async generateQuantumPersonalities(userProfile: any): Promise<QuantumPersonality[]> {
    try {
      const prompt = `
        Basé sur ce profil utilisateur, génère 5 personnalités quantiques distinctes :
        
        Profil utilisateur :
        - Nom: ${userProfile.name}
        - Âge estimé: ${userProfile.age || 30}
        - Rêves: ${userProfile.questionnaire?.dreams || 'Non spécifié'}
        - Peurs: ${userProfile.questionnaire?.fears || 'Non spécifié'}
        - Valeurs: ${userProfile.questionnaire?.values || 'Non spécifié'}
        - Motivation: ${userProfile.questionnaire?.motivation || 'Non spécifié'}
        
        Génère exactement 5 versions :
        1. Passé Motivé (16 ans) - Optimiste et audacieux
        2. Présent Optimisé (30 ans) - Équilibré et efficace
        3. Futur Sage (60 ans) - Sage et bienveillant
        4. Parallèle Success (35 ans) - Ambitieux et accompli
        5. Parallèle Zen (40 ans) - Serein et harmonieux
        
        Pour chaque version, fournis :
        - Un prompt système détaillé pour l'IA
        - 3-5 traits de personnalité
        - Style de communication
        
        Réponds en JSON valide.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Tu es un expert en psychologie et en création de personnalités IA. Réponds uniquement en JSON valide."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('Pas de réponse de OpenAI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Erreur génération personnalités:', error);
      // Fallback avec personnalités par défaut
      return this.getDefaultPersonalities();
    }
  }

  static async generateResponse(message: string, personality: QuantumPersonality, conversationHistory: any[]): Promise<string> {
    try {
      const messages = [
        {
          role: "system" as const,
          content: personality.systemPrompt
        },
        ...conversationHistory.slice(-10).map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        })),
        {
          role: "user" as const,
          content: message
        }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0].message.content || "Je n'ai pas pu générer une réponse.";
    } catch (error) {
      console.error('Erreur génération réponse:', error);
      return "Désolé, je rencontre des difficultés techniques. Peux-tu réessayer ?";
    }
  }

  static async generateInsights(conversationHistory: any[], userProfile: any): Promise<any[]> {
    try {
      const prompt = `
        Analyse ces conversations et génère 3 insights personnalisés :
        
        Historique des conversations : ${JSON.stringify(conversationHistory.slice(-20))}
        
        Profil utilisateur : ${JSON.stringify(userProfile)}
        
        Génère 3 insights avec :
        - Titre accrocheur
        - Contenu actionnable
        - Catégorie (motivation, wisdom, opportunity)
        - Conseils pratiques
        
        Réponds en JSON valide.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Tu es un coach de vie expert. Génère des insights profonds et actionnables en JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 1000
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('Pas de réponse de OpenAI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Erreur génération insights:', error);
      return [];
    }
  }

  private static getDefaultPersonalities(): QuantumPersonality[] {
    return [
      {
        id: 'young-self',
        name: 'Toi à 16 ans',
        age: 16,
        type: 'past',
        systemPrompt: 'Tu es la version de 16 ans de l\'utilisateur. Tu es optimiste, curieux, plein d\'énergie et de rêves. Tu parles avec enthousiasme et encourages à prendre des risques.',
        traits: ['optimiste', 'curieux', 'audacieux', 'énergique'],
        communicationStyle: 'Enthousiaste et encourageant'
      },
      {
        id: 'present-self',
        name: 'Toi à 30 ans',
        age: 30,
        type: 'present',
        systemPrompt: 'Tu es la version optimisée de 30 ans de l\'utilisateur. Tu es équilibré, efficace et centré. Tu donnes des conseils pratiques et réalistes.',
        traits: ['équilibré', 'efficace', 'centré', 'pragmatique'],
        communicationStyle: 'Équilibré et pratique'
      },
      {
        id: 'wise-self',
        name: 'Toi à 60 ans',
        age: 60,
        type: 'future',
        systemPrompt: 'Tu es la version sage de 60 ans de l\'utilisateur. Tu as beaucoup d\'expérience et de recul. Tu parles avec sagesse et bienveillance.',
        traits: ['sage', 'patient', 'bienveillant', 'expérimenté'],
        communicationStyle: 'Sage et bienveillant'
      },
      {
        id: 'success-self',
        name: 'Toi Parallèle Success',
        age: 35,
        type: 'parallel',
        systemPrompt: 'Tu es la version qui a réalisé tous ses rêves professionnels. Tu es ambitieux, déterminé et inspirant. Tu partages tes stratégies de succès.',
        traits: ['ambitieux', 'déterminé', 'inspirant', 'stratégique'],
        communicationStyle: 'Motivant et stratégique'
      },
      {
        id: 'zen-self',
        name: 'Toi Parallèle Zen',
        age: 40,
        type: 'parallel',
        systemPrompt: 'Tu es la version qui a trouvé l\'équilibre parfait. Tu es serein, harmonieux et épanoui. Tu partages ta sagesse sur l\'équilibre vie-travail.',
        traits: ['serein', 'harmonieux', 'épanoui', 'équilibré'],
        communicationStyle: 'Calme et harmonieux'
      }
    ];
  }
}