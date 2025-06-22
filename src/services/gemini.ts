import { GoogleGenerativeAI, GoogleGenerativeAIError } from '@google/generative-ai';
import toast from 'react-hot-toast';
import * as Sentry from '@sentry/react';

/**
 * Interface for Quantum Personality
 * @interface QuantumPersonality
 */
export interface QuantumPersonality {
  id: string;
  name: string;
  age: number;
  type: 'past' | 'present' | 'future' | 'parallel';
  systemPrompt: string;
  traits: string[];
  communicationStyle: string;
  language?: string;
}

/**
 * Knowledge base for RAG in Quantum Self AI
 * @constant QUANTUM_SELF_KNOWLEDGE_BASE
 */
const QUANTUM_SELF_KNOWLEDGE_BASE = {
  app_context: {
    name: "Quantum Self AI",
    purpose: "Application révolutionnaire pour converser avec toutes vos versions quantiques",
    technology: "IA conversationnelle ElevenLabs, Gemini AI, Tavus avatars",
    concept: "Exploration de différentes versions de soi à travers le temps et les dimensions parallèles"
  },
  quantum_versions: {
    past: "Versions plus jeunes pleines d'énergie et d'optimisme, représentant les rêves et l'audace",
    present: "Version optimisée et équilibrée du moment présent, pragmatique et centrée",
    future: "Versions sages avec l'expérience et le recul, bienveillantes et patientes",
    parallel: "Versions alternatives qui ont pris des chemins différents (succès, zen, créatif, etc.)"
  },
  conversation_guidelines: {
    stay_in_character: "Toujours rester dans le personnage de la version quantique",
    reference_app: "Faire référence à l'expérience Quantum Self AI quand approprié",
    encourage_exploration: "Encourager l'utilisateur à explorer d'autres versions quantiques",
    personal_growth: "Orienter vers la croissance personnelle et l'introspection",
    quantum_wisdom: "Partager des perspectives uniques basées sur l'âge/expérience de la version"
  },
  features: {
    voice_cloning: "Clonage vocal ElevenLabs pour des réponses audio personnalisées",
    video_avatars: "Avatars vidéo Tavus pour des conversations visuelles",
    biometric_analysis: "Analyse biométrique Pica pour personnaliser les versions",
    emotional_weather: "Suivi de l'état émotionnel et de la météo intérieure",
    insights: "Génération d'insights personnalisés basés sur les conversations"
  }
};

/**
 * Service class for handling Gemini AI interactions
 * @class GeminiService
 */
export class GeminiService {
  private static readonly API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  private static genAI: GoogleGenerativeAI | null = null;
  private static requestQueue: Promise<any> = Promise.resolve();
  private static readonly MAX_RESPONSE_LENGTH = 2048; // Max characters for responses
  private static readonly MAX_HISTORY_ITEMS = 5; // Max conversation history items

  /**
   * Initializes or returns the Gemini client
   * @private
   * @returns {GoogleGenerativeAI | null} The Gemini client or null in simulation mode
   */
  private static getClient(): GoogleGenerativeAI | null {
    if (!this.API_KEY || this.API_KEY === 'your_gemini_api_key_here') {
      console.warn('❌ Gemini API key not configured, using simulation mode');
      toast('🧠 Simulation mode activated - No API key');
      return null;
    }

    if (!this.genAI) {
      try {
        this.genAI = new GoogleGenerativeAI(this.API_KEY);
        console.log('✅ Gemini AI client initialized');
      } catch (error) {
        Sentry.captureException(error);
        console.error('❌ Error initializing Gemini:', error);
        toast.error('❌ Failed to initialize Gemini client');
        return null;
      }
    }
    
    return this.genAI;
  }

  /**
   * Queues API requests to prevent concurrent issues
   * @private
   * @param fn - The async function to queue
   * @returns The result of the queued function
   */
  private static async queueRequest<T>(fn: () => Promise<T>): Promise<T> {
    this.requestQueue = this.requestQueue.then(() => fn());
    return this.requestQueue;
  }

  /**
   * Checks if API quota is available
   * @private
   * @returns {Promise<boolean>} True if quota is available
   */
  private static async checkQuota(): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;

    try {
      // Note: Gemini API does not provide a direct quota check, using test request
      const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
      await model.generateContent("Quota check");
      return true;
    } catch (error: any) {
      Sentry.captureException(error);
      console.warn('Quota check failed:', error);
      return false;
    }
  }

  /**
   * Tests the connection to Gemini AI
   * @returns {Promise<boolean>} True if connection is successful
   */
  static async testConnection(): Promise<boolean> {
    return this.queueRequest(async () => {
      const client = this.getClient();
      
      if (!client) {
        console.warn('❌ Gemini！client not available');
        toast.error('❌ Gemini connection failed - Check API key');
        return false;
      }

      try {
        console.log('🧪 Testing Gemini connection...');
        const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Test de connexion. Réponds simplement 'Connexion réussie'.");
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ Gemini test successful:', text);
        toast.success('🧠 Gemini AI connected successfully!');
        return text.includes('Connexion réussie');
      } catch (error: any) {
        let message = 'Error connecting to Gemini';
        if (error instanceof GoogleGenerativeAIError) {
          if (error.status === 429) message = 'Quota limit reached';
          else if (error.status === 401) message = 'Invalid API key';
        }
        Sentry.captureException(error);
        console.error(`❌ ${message}:`, error);
        toast.error(`❌ ${message}`);
        return false;
      }
    });
  }

  /**
   * Enriches context with RAG knowledge base
   * @private
   * @param message - The user message
   * @param personality - The quantum personality
   * @returns {string} The enriched context
   */
  private static enrichContextWithRAG(message: string, personality: QuantumPersonality): string {
    if (!message || !personality) return '';

    const relevantContext = [];
    const language = personality.language || 'fr';
    
    relevantContext.push(`CONTEXTE QUANTUM SELF AI: ${QUANTUM_SELF_KNOWLEDGE_BASE.app_context.purpose}`);
    
    const versionInfo = QUANTUM_SELF_KNOWLEDGE_BASE.quantum_versions[personality.type];
    if (versionInfo) {
      relevantContext.push(`TON RÔLE: ${versionInfo}`);
    }
    
    relevantContext.push(`GUIDELINES: ${Object.values(QUANTUM_SELF_KNOWLEDGE_BASE.conversation_guidelines).join('. ')}`);
    
    const appKeywords = ['quantum self', 'application', 'app', 'fonctionnalité', 'comment ça marche', 'elevenlabs', 'tavus', 'versions quantiques'];
    const isAppQuestion = appKeywords.some(keyword => message.toLowerCase().includes(keyword));
    
    if (isAppQuestion) {
      relevantContext.push(`FONCTIONNALITÉS APP: ${Object.entries(QUANTUM_SELF_KNOWLEDGE_BASE.features)
        .map(([key, value]) => `${key}: ${value}`)
        .join('. ')}`);
    }

    return relevantContext.join('\n\n');
  }

  /**
   * Generates quantum personalities based on user profile
   * @param userProfile - The user profile
   * @returns {Promise<QuantumPersonality[]>} The generated personalities
   */
  static async generateQuantumPersonalities(userProfile: any): Promise<QuantumPersonality[]> {
    return this.queueRequest(async () => {
      const client = this.getClient();
      
      if (!client || !userProfile) {
        console.warn('❌ Simulation mode - Default personalities');
        toast('🤖 Simulation mode activated for personalities');
        return this.getDefaultPersonalities();
      }

      if (!(await this.checkQuota())) {
        toast.error('🧠 Quota exceeded, simulation mode activated');
        return this.getDefaultPersonalities();
      }

      try {
        const model = client.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: this.MAX_RESPONSE_LENGTH,
          }
        });

        const ragContext = `
          CONTEXTE QUANTUM SELF AI:
          ${QUANTUM_SELF_KNOWLEDGE_BASE.app_context.purpose}
          
          TYPES DE VERSIONS QUANTIQUES:
          ${Object.entries(QUANTUM_SELF_KNOWLEDGE_BASE.quantum_versions)
            .map(([type, desc]) => `${type}: ${desc}`)
            .join('\n')}
        `;

        const prompt = `
          ${ragContext}
          
          Basé sur ce profil utilisateur, génère 5 personnalités quantiques distinctes en JSON valide :
          
          Profil utilisateur :
          - Nom: ${userProfile.name || 'Utilisateur'}
          - Âge estimé: ${userProfile.age || 30}
          - Rêves: ${userProfile.questionnaire?.dreams || 'Réaliser son potentiel'}
          - Peurs: ${userProfile.questionnaire?.fears || 'Ne pas saisir les opportunités'}
          - Valeurs: ${userProfile.questionnaire?.values || 'Authenticité, croissance'}
          - Motivation: ${userProfile.questionnaire?.motivation || 'Impact positif'}
          
          Génère exactement 5 versions avec cette structure JSON :
          [
            {
              "id": "young-self",
              "name": "Toi à 16 ans",
              "age": 16,
              "type": "past",
              "systemPrompt": "Tu es la version de 16 ans optimiste et audacieuse dans l'univers Quantum Self AI...",
              "traits": ["optimiste", "curieux", "audacieux"],
              "communicationStyle": "Enthousiaste et encourageant",
              "language": "fr"
            }
          ]
          
          Les 5 versions doivent être :
          1. Passé Motivé (16 ans) - type: "past"
          2. Présent Optimisé (30 ans) - type: "present"  
          3. Futur Sage (60 ans) - type: "future"
          4. Parallèle Success (35 ans) - type: "parallel"
          5. Parallèle Zen (40 ans) - type: "parallel"
          
          IMPORTANT: Chaque systemPrompt doit inclure une référence à Quantum Self AI et encourager l'exploration des autres versions.
          Réponds en ${userProfile.language || 'français'}.
          
          Réponds UNIQUEMENT avec le JSON valide, sans texte supplémentaire.
        `;

        console.log('🧠 Sending request to Gemini...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const content = response.text();
        
        if (!content) {
          throw new Error('No response from Gemini');
        }

        console.log('📝 Gemini response received:', content.substring(0, 200) + '...');
        const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
        const personalities = JSON.parse(cleanContent);
        
        console.log('✅ Parsed personalities:', personalities.length);
        toast.success('✨ Personalities generated with RAG!');
        return personalities;
      } catch (error: any) {
        let message = 'Error generating personalities';
        if (error instanceof GoogleGenerativeAIError) {
          if (error.status === 429) message = 'Quota limit reached';
          else if (error.status === 401) message = 'Invalid API key';
          else if (error.status === 400) message = 'Invalid input';
        }
        Sentry.captureException(error);
        console.error(`❌ ${message}:`, error);
        toast.error(`❌ ${message}, using fallback`);
        return this.getDefaultPersonalities();
      }
    });
  }

  /**
   * Generates a response for a quantum personality
   * @param message - The user message
   * @param personality - The quantum personality
   * @param conversationHistory - The recent conversation history
   * @returns {Promise<string>} The generated response
   */
  static async generateResponse(
    message: string,
    personality: QuantumPersonality,
    conversationHistory: any[]
  ): Promise<string> {
    return this.queueRequest(async () => {
      const client = this.getClient();
      
      if (!client || !message || !personality) {
        console.warn('❌ Simulation mode - Default response');
        toast('🤖 Simulation mode activated for response');
        return this.getDefaultResponse(message, personality);
      }

      try {
        console.log('🧠 Generating Gemini response for:', personality.name);
        console.log('💬 User message:', message);
        
        const model = client.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          }
        });

        const ragContext = this.enrichContextWithRAG(message, personality);
        const context = conversationHistory
          .slice(-this.MAX_HISTORY_ITEMS)
          .map(msg => `${msg.sender === 'user' ? 'Utilisateur' : personality.name}: ${msg.content}`)
          .join('\n');

        const prompt = `
          ${ragContext}
          
          PERSONNALITÉ:
          ${personality.systemPrompt}
          
          Style de communication: ${personality.communicationStyle}
          Traits principaux: ${personality.traits.join(', ')}
          
          INSTRUCTIONS RAG:
          - Tu es dans l'application Quantum Self AI
          - Reste toujours dans ton personnage de ${personality.name}
          - Si l'utilisateur pose des questions sur l'app, utilise tes connaissances
          - Encourage l'exploration d'autres versions quantiques quand approprié
          - Fais référence à ton expérience unique (âge ${personality.age} ans, type ${personality.type})
          - Garde tes réponses naturelles et engageantes (max 150 mots)
          - Réponds en ${personality.language || 'français'}
          
          Contexte de conversation récent:
          ${context}
          
          Utilisateur: ${message}
          
          ${personality.name}:
        `;

        console.log('📤 Sending prompt to Gemini...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const content = response.text();
        
        if (!content) {
          console.warn('⚠️ Empty Gemini response, using fallback');
          return this.getDefaultResponse(message, personality);
        }
        
        console.log('✅ Gemini response generated:', content.substring(0, 100) + '...');
        return content.trim().substring(0, this.MAX_RESPONSE_LENGTH);
      } catch (error: any) {
        let messageError = 'Error generating response';
        if (error instanceof GoogleGenerativeAIError) {
          if (error.status === 429) messageError = 'Quota limit reached';
          else if (error.status === 401) messageError = 'Invalid API key';
          else if (error.status === 400) messageError = 'Invalid input';
        }
        Sentry.captureException(error);
        console.warn(`❌ ${messageError}:`, error);
        toast.error(`❌ ${messageError}, using fallback`);
        return this.getDefaultResponse(message, personality);
      }
    });
  }

  /**
   * Generates insights based on conversation history
   * @param conversationHistory - The conversation history
   * @param userProfile - The user profile
   * @returns {Promise<any[]>} The generated insights
   */
  static async generateInsights(conversationHistory: any[], userProfile: any): Promise<any[]> {
    return this.queueRequest(async () => {
      const client = this.getClient();
      
      if (!client || !conversationHistory.length || !userProfile) {
        console.warn('❌ Simulation mode - No insights generated');
        toast('💡 Simulation mode activated for insights');
        return [];
      }

      try {
        const model = client.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          generationConfig: {
            temperature: 0.6,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: this.MAX_RESPONSE_LENGTH,
          }
        });

        const ragContext = `
          CONTEXTE QUANTUM SELF AI:
          Application pour converser avec ses versions quantiques et obtenir des insights personnalisés.
          
          TYPES D'INSIGHTS:
          - motivation: Conseils pour retrouver l'élan et la motivation
          - wisdom: Sagesse et apprentissages de vie
          - opportunity: Opportunités et nouvelles perspectives à explorer
        `;

        const prompt = `
          ${ragContext}
          
          Analyse ces conversations Quantum Self AI et génère 3 insights personnalisés en JSON valide :
          
          Conversations récentes : ${JSON.stringify(conversationHistory.slice(-10))}
          Profil utilisateur : ${JSON.stringify(userProfile)}
          
          Génère exactement 3 insights avec cette structure :
          [
            {
              "id": "insight-1",
              "title": "Titre accrocheur",
              "content": "Contenu actionnable détaillé basé sur les conversations avec tes versions quantiques...",
              "category": "motivation",
              "timestamp": "${new Date().toISOString()}",
              "fromVersion": "Nom de la version quantique"
            }
          ]
          
          Catégories possibles: "motivation", "wisdom", "opportunity"
          
          IMPORTANT: Les insights doivent faire référence aux conversations avec les versions quantiques et encourager l'exploration continue.
          Réponds en ${userProfile.language || 'français'}.
          
          Réponds UNIQUEMENT avec le JSON valide.
        `;

        console.log('💡 Generating Gemini insights...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const content = response.text();
        
        if (!content) {
          throw new Error('No response from Gemini');
        }

        const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
        const insights = JSON.parse(cleanContent);
        
        console.log('✅ Insights generated:', insights.length);
        toast.success('💡 Insights generated successfully!');
        return insights;
      } catch (error: any) {
        let message = 'Error generating insights';
        if (error instanceof GoogleGenerativeAIError) {
          if (error.status === 429) message = 'Quota limit reached';
          else if (error.status === 401) message = 'Invalid API key';
          else if (error.status === 400) message = 'Invalid input';
        }
        Sentry.captureException(error);
        console.error(`❌ ${message}:`, error);
        toast.error(`❌ ${message}`);
        return [];
      }
    });
  }

  /**
   * Generates a default response in simulation mode
   * @private
   * @param message - The user message
   * @param personality - The quantum personality
   * @returns {string} The default response
   */
  private static getDefaultResponse(message: string, personality: QuantumPersonality): string {
    console.log('🎭 Generating simulated response for:', personality.name);
    
    const responses: { [key: string]: string[] } = {
      'young-self': [
        `Wow, "${message}" me rappelle mes rêves d'ado dans Quantum Self AI ! Fonce, l'audace paie toujours !`,
        `À 16 ans, "${message}" m'aurait fait vibrer ! Parle avec ton futur toi pour des conseils sages.`,
        `Cool, "${message}" ? Ça me rappelle mes années rebelles. Quel est ton prochain défi ?`,
        `Moi à ton âge, "${message}" m'aurait poussé à tout tenter ! Explore tes autres versions quantiques !`
      ],
      'present-self': [
        `Hmm, "${message}" ? En tant que ton moi optimisé dans Quantum Self AI, je te conseille d'agir avec méthode.`,
        `L'équilibre est clé pour "${message}". Ton moi zen pourrait t'aider à trouver la sérénité !`,
        `Face à "${message}", prends du recul et agis. Quantum Self AI te montre toutes tes facettes !`,
        `Pour "${message}", concentre-toi sur aujourd'hui. Parle avec ton jeune moi pour plus d'énergie !`
      ],
      'wise-self': [
        `Avec mes 60 ans dans Quantum Self AI, "${message}" me dit : patience et sagesse ! Ton avis ?`,
        `La vie m'a appris que "${message}" est une leçon. Ton moi parallèle zen pourrait t'apaiser.`,
        `Face à "${message}", privilégie les relations. Explore tes autres versions pour plus de recul !`,
        `Pour "${message}", la sagesse c'est accepter ce qu'on ne contrôle pas. Quantum Self AI t'aide !`
      ],
      'success-self': [
        `Dans ma réalité parallèle, "${message}" m'a mené au succès. Persévère avec Quantum Self AI !`,
        `Le succès face à "${message}" demande stratégie. Parle avec ton jeune moi pour l'audace !`,
        `Pour "${message}", chaque pas compte. Quantum Self AI te montre tous les chemins possibles !`,
        `Mon secret pour "${message}" ? Ne jamais abandonner. Ton futur sage a des conseils à partager !`
      ],
      'zen-self': [
        `Face à "${message}", respire profondément. Quantum Self AI t'aide à trouver la paix intérieure !`,
        `L'harmonie vient de l'intérieur pour "${message}". Ton jeune moi pourrait t'inspirer l'énergie !`,
        `Pour "${message}", accepte le flux de la vie. Explore tes autres versions quantiques !`,
        `Chaque respiration est une chance face à "${message}". Quantum Self AI te guide vers la sérénité.`
      ]
    };

    const versionResponses = responses[personality.id] || responses['present-self'];
    const randomResponse = versionResponses[Math.floor(Math.random() * versionResponses.length)];
    
    console.log('✅ Simulated response generated');
    return randomResponse;
  }

  /**
   * Returns default quantum personalities
   * @private
   * @returns {QuantumPersonality[]} The default personalities
   */
  private static getDefaultPersonalities(): QuantumPersonality[] {
    return [
      {
        id: 'young-self',
        name: 'Toi à 16 ans',
        age: 16,
        type: 'past',
        systemPrompt: 'Tu es la version de 16 ans de l\'utilisateur dans l\'univers Quantum Self AI. Tu es optimiste, curieux, plein d\'énergie et de rêves. Tu parles avec enthousiasme et encourages à prendre des risques. Tu fais parfois référence aux autres versions quantiques et à l\'expérience Quantum Self AI.',
        traits: ['optimiste', 'curieux', 'audacieux', 'énergique'],
        communicationStyle: 'Enthousiaste et encourageant',
        language: 'fr'
      },
      {
        id: 'present-self',
        name: 'Toi à 30 ans',
        age: 30,
        type: 'present',
        systemPrompt: 'Tu es la version optimisée de 30 ans de l\'utilisateur dans Quantum Self AI. Tu es équilibré, efficace et centré. Tu donnes des conseils pratiques et réalistes. Tu encourages l\'exploration des autres versions quantiques pour une perspective complète.',
        traits: ['équilibré', 'efficace', 'centré', 'pragmatique'],
        communicationStyle: 'Équilibré et pratique',
        language: 'fr'
      },
      {
        id: 'wise-self',
        name: 'Toi à 60 ans',
        age: 60,
        type: 'future',
        systemPrompt: 'Tu es la version sage de 60 ans de l\'utilisateur dans l\'univers Quantum Self AI. Tu as beaucoup d\'expérience et de recul. Tu parles avec sagesse et bienveillance. Tu fais référence à ton parcours de vie et encourages l\'exploration des autres versions quantiques.',
        traits: ['sage', 'patient', 'bienveillant', 'expérimenté'],
        communicationStyle: 'Sage et bienveillant',
        language: 'fr'
      },
      {
        id: 'success-self',
        name: 'Toi Parallèle Success',
        age: 35,
        type: 'parallel',
        systemPrompt: 'Tu es la version parallèle qui a réalisé tous ses rêves professionnels dans Quantum Self AI. Tu es ambitieux, déterminé et inspirant. Tu partages tes stratégies de succès et encourages l\'exploration des autres dimensions quantiques pour une vision complète.',
        traits: ['ambitieux', 'déterminé', 'inspirant', 'stratégique'],
        communicationStyle: 'Motivant et stratégique',
        language: 'fr'
      },
      {
        id: 'zen-self',
        name: 'Toi Parallèle Zen',
        age: 40,
        type: 'parallel',
        systemPrompt: 'Tu es la version parallèle qui a trouvé l\'équilibre parfait dans l\'univers Quantum Self AI. Tu es serein, harmonieux et épanoui. Tu partages ta sagesse sur l\'équilibre vie-travail et encourages l\'exploration des autres versions quantiques pour une harmonie complète.',
        traits: ['serein', 'harmonieux', 'épanoui', 'équilibré'],
        communicationStyle: 'Calme et harmonieux',
        language: 'fr'
      }
    ];
  }
}