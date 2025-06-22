import { ElevenLabsClient, ElevenLabsError } from '@elevenlabs/elevenlabs-js';
import toast from 'react-hot-toast';
import * as Sentry from '@sentry/react';

/**
 * Interface for voice clone result
 * @interface VoiceCloneResult
 */
export interface VoiceCloneResult {
  voiceId: string;
  name: string;
  status: 'processing' | 'ready' | 'error';
}

/**
 * Interface for personality configuration
 * @interface Personality
 */
export interface Personality {
  name: string;
  systemPrompt: string;
  communicationStyle: 'motivational' | 'wise' | 'calm' | 'professional';
  traits: string[];
  language?: string;
}

/**
 * Service class for handling ElevenLabs API interactions
 * @class ElevenLabsService
 */
export class ElevenLabsService {
  private static readonly API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
  private static client: ElevenLabsClient | null = null;
  private static requestQueue: Promise<any> = Promise.resolve();
  private static readonly AUDIO_MAX_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly TEXT_MAX_LENGTH = 1000; // Max characters for speech

  /**
   * Initializes or returns the ElevenLabs client
   * @private
   * @returns {ElevenLabsClient | null} The ElevenLabs client or null in simulation mode
   */
  private static getClient(): ElevenLabsClient | null {
    const maskedKey = this.API_KEY ? `${this.API_KEY.slice(0, 4)}...${this.API_KEY.slice(-4)}` : 'non définie';
    console.log('🔑 Clé API ElevenLabs:', maskedKey);
    if (!this.API_KEY) {
      console.warn('ElevenLabs API key not configured, using simulation mode');
      toast('🎤 Clé API ElevenLabs manquante, mode simulation activé', {
        style: { background: '#fefcbf', color: '#b45309' },
      });
      return null;
    }

    if (!this.client) {
      this.client = new ElevenLabsClient({
        apiKey: this.API_KEY,
      });
      console.log('🔍 Structure du client ElevenLabs:', Object.keys(this.client));
    }
    
    return this.client;
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
      // Hypothetical quota check, replace with actual ElevenLabs API if available
      return true; // Placeholder until actual quota API is confirmed
    } catch (error) {
      Sentry.captureException(error);
      console.warn('Quota check failed:', error);
      return false;
    }
  }

  /**
   * Clones a voice from an audio blob
   * @param audioBlob - The audio file to clone
   * @param name - The name of the voice
   * @returns {Promise<VoiceCloneResult>} The cloned voice details
   */
  static async cloneVoice(audioBlob: Blob, name: string): Promise<VoiceCloneResult> {
    return this.queueRequest(async () => {
      const client = this.getClient();
      
      if (!client || !audioBlob.size || audioBlob.size < 1024) {
        const errorMsg = !audioBlob.size || audioBlob.size < 1024 
          ? 'Invalid audio file: empty or too small' 
          : 'Simulation mode - Voice cloned (demo)';
        console.warn(errorMsg);
        toast(errorMsg.includes('Invalid') ? `🎤 ${errorMsg}` : '🎤 Simulation mode - Voice cloned (demo)', {
          style: { background: '#fefcbf', color: '#b45309' },
        });
        return {
          voiceId: `demo-voice-${Date.now()}`,
          name: `${name}_demo_voice`,
          status: 'ready'
        };
      }

      if (!(await this.checkQuota())) {
        toast.error('🎤 Quota exceeded, simulation mode activated');
        return {
          voiceId: `demo-voice-${Date.now()}`,
          name: `${name}_demo_voice`,
          status: 'ready'
        };
      }

      try {
        const audioFile = new File([audioBlob], 'voice_sample.wav', { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('name', `${name}_quantum_voice`);
        formData.append('files', audioFile);
        formData.append('description', `Cloned voice for ${name} - Quantum Self AI`);
        formData.append('labels', JSON.stringify({
          accent: 'french',
          age: 'adult',
          gender: 'unisex',
          use_case: 'conversation'
        }));

        const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
          method: 'POST',
          headers: {
            'xi-api-key': this.API_KEY,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new ElevenLabsError(`Failed to clone voice: ${response.statusText}`, response.status);
        }

        const voice = await response.json();
        toast.success('🎤 Voix clonée avec succès !');
        return {
          voiceId: voice.voice_id,
          name: voice.name,
          status: 'ready'
        };
      } catch (error: any) {
        let message = 'Erreur lors du clonage de la voix';
        if (error instanceof ElevenLabsError) {
          if (error.status === 429) message = 'Quota dépassé';
          else if (error.status === 401) message = 'Clé API invalide';
          else if (error.status === 400) message = 'Fichier audio invalide';
        }
        Sentry.captureException(error);
        console.error(`${message}:`, error);
        toast.error(`🎤 ${message}, mode simulation activé`);
        return {
          voiceId: `demo-voice-${Date.now()}`,
          name: `${name}_demo_voice`,
          status: 'ready'
        };
      }
    });
  }

  /**
   * Generates speech from text
   * @param text - The text to convert to speech
   * @param voiceId - The voice ID to use
   * @returns {Promise<Blob>} The generated audio blob
   */
  static async generateSpeech(text: string, voiceId: string = 'bIHbv24MWmeRgasZH58o'): Promise<Blob> {
    return this.queueRequest(async () => {
      const client = this.getClient();
      
      // Validate text
      if (!text?.trim()) {
        const error = new Error('Text cannot be empty');
        Sentry.captureException(error);
        console.warn('Error generating speech:', error.message);
        toast.error('🔊 Texte vide, mode simulation activé');
        return new Blob([new ArrayBuffer(0)], { type: 'audio/mpeg' });
      }

      // Validate voiceId
      let validatedVoiceId = voiceId;
      if (!validatedVoiceId || validatedVoiceId === 'default-voice-id' || validatedVoiceId === 'default') {
        console.warn('Invalid or default voiceId, using Will as default');
        validatedVoiceId = 'bIHbv24MWmeRgasZH58o'; // Will, male, American, conversational
        console.log('Using voiceId:', validatedVoiceId);
      }

      if (!client) {
        console.warn('Simulation mode - Audio generated (demo)');
        toast('🔊 Clé API ElevenLabs manquante, audio simulé', {
          style: { background: '#fefcbf', color: '#b45309' },
        });
        return new Blob([new ArrayBuffer(0)], { type: 'audio/mpeg' });
      }

      try {
        const trimmedText = text.substring(0, this.TEXT_MAX_LENGTH);
        const audio = await client.textToSpeech.convert(validatedVoiceId, {
          text: trimmedText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true
          }
        });

        const chunks: Uint8Array[] = [];
        const reader = audio.getReader();
        let totalSize = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          totalSize += value.length;
          if (totalSize > this.AUDIO_MAX_SIZE) {
            throw new Error('Audio size exceeds limit');
          }
          chunks.push(value);
        }

        const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
        if (audioBlob.size === 0) {
          throw new Error('Generated audio is empty');
        }

        toast.success('🔊 Audio généré avec succès !');
        return audioBlob;
      } catch (error: any) {
        let message = 'Erreur lors de la génération de l\'audio';
        if (error instanceof ElevenLabsError) {
          if (error.status === 429) message = 'Quota dépassé';
          else if (error.status === 401) message = 'Clé API invalide';
          else if (error.status === 400) message = `Paramètres invalides : ${error.message || 'Vérifiez l\'ID de voix et le texte'}`;
          else if (error.status === 404) message = 'ID de voix non trouvé';
        }
        Sentry.captureException(error);
        console.error(`${message}:`, error);
        toast.error(`🔊 ${message}`);
        return new Blob([new ArrayBuffer(0)], { type: 'audio/mpeg' });
      }
    });
  }

  /**
   * Transcribes audio using Web Speech API
   * @param audioBlob - The audio blob to transcribe (used for compatibility, but Web Speech API uses live audio)
   * @returns {Promise<string>} The transcribed text
   */
  static async transcribeAudio(audioBlob: Blob): Promise<string> {
    return this.queueRequest(async () => {
      if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        const error = new Error('SpeechRecognition API not supported in this browser');
        Sentry.captureException(error);
        console.error('Transcription error:', error.message);
        toast.error('🔴 Speech recognition not supported. Please use text mode.');
        throw error;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR'; // Adjust based on app language (e.g., 'en-US' for English)
      recognition.continuous = false;
      recognition.interimResults = false;

      return new Promise((resolve, reject) => {
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          console.debug('✅ Transcription result:', transcript);
          resolve(transcript);
        };

        recognition.onerror = (event) => {
          const errorMessage = `Speech recognition error: ${event.error}`;
          Sentry.captureException(new Error(errorMessage));
          console.error('Transcription error:', errorMessage);
          if (event.error === 'no-speech') {
            toast('⚠️ No speech detected. Please speak clearly and try again.', {
              style: { background: '#fefcbf', color: '#b45309' },
            });
            reject(new Error('No speech detected'));
          } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            toast.error('🔴 Microphone access denied. Please allow microphone permissions.');
            reject(new Error('Microphone access denied'));
          } else {
            toast.error('🔴 Speech recognition failed. Please try again or use text mode.');
            reject(new Error(errorMessage));
          }
        };

        recognition.onend = () => {
          console.debug('🛑 Speech recognition ended');
        };

        console.debug('🎙️ Starting speech recognition');
        recognition.start();

        // Timeout after 10 seconds (matches recording limit)
        setTimeout(() => {
          recognition.stop();
          reject(new Error('Speech recognition timeout'));
        }, 10000);
      });
    });
  }

  /**
   * Retrieves all available voices
   * @returns {Promise<any[]>} List of voices
   */
  static async getVoices(): Promise<any[]> {
    return this.queueRequest(async () => {
      const client = this.getClient();
      
      if (!client) {
        console.warn('Simulation mode - Default voices');
        return [
          { voice_id: 'demo-voice-1', name: 'Demo Voice 1', category: 'premade' },
          { voice_id: 'demo-voice-2', name: 'Demo Voice 2', category: 'premade' }
        ];
      }

      try {
        const voices = await client.voices.getAll();
        return voices.voices || [];
      } catch (error: any) {
        console.error('Erreur lors de la récupération des voix:', error);
        return [];
      }
    });
  }

  /**
   * Deletes a voice
   * @param voiceId - The voice ID to delete
   * @returns {Promise<boolean>} True if deleted successfully
   */
  static async deleteVoice(voiceId: string): Promise<boolean> {
    return this.queueRequest(async () => {
      const client = this.getClient();
      
      if (!client || !voiceId) {
        console.warn('Simulation mode - Deletion simulated');
        return true;
      }

      try {
        await client.voices.delete(voiceId);
        toast.success('🎤 Voix supprimée avec succès !');
        return true;
      } catch (error: any) {
        Sentry.captureException(error);
        console.error('Erreur lors de la suppression de la voix:', error);
        toast.error('🎤 Erreur lors de la suppression de la voix');
        return false;
      }
    });
  }

  /**
   * Retrieves voice settings
   * @param voiceId - The voice ID
   * @returns {Promise<any>} The voice settings
   */
  static async getVoiceSettings(voiceId: string): Promise<any> {
    return this.queueRequest(async () => {
      const client = this.getClient();
      
      if (!client || !voiceId) {
        console.warn('Simulation mode - Default settings');
        return {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true
        };
      }

      try {
        const settings = await client.voices.getSettings(voiceId);
        return settings;
      } catch (error: any) {
        Sentry.captureException(error);
        console.error('Erreur lors de la récupération des paramètres de voix:', error);
        return {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true
        };
      }
    });
  }

  /**
   * Updates voice settings
   * @param voiceId - The voice ID
   * @param settings - The new settings
   * @returns {Promise<boolean>} True if updated successfully
   */
  static async updateVoiceSettings(voiceId: string, settings: any): Promise<boolean> {
    return this.queueRequest(async () => {
      const client = this.getClient();
      
      if (!client || !voiceId) {
        console.warn('Simulation mode - Update simulated');
        return true;
      }

      try {
        await client.voices.editSettings(voiceId, settings);
        toast.success('🎤 Paramètres de voix mis à jour !');
        return true;
      } catch (error: any) {
        Sentry.captureException(error);
        console.error('Erreur lors de la mise à jour des paramètres de voix:', error);
        toast.error('🎤 Erreur lors de la mise à jour des paramètres de voix');
        return false;
      }
    });
  }

  /**
   * Generates simulated responses based on personality
   * @param message - The input message
   * @param personality - Optional personality configuration
   * @returns {string} Simulated response
   */
  static getSimulatedResponse(message: string, personality?: Personality): string {
    const responsesByPersonality = {
      'Toi à 16 ans': [
        `Wow, "${message}" me rappelle mes rêves d'ado ! Qu'est-ce qui te motive aujourd'hui ?`,
        `À 16 ans, j'étais plein d'énergie. Parle-moi de tes passions !`,
        `Cool, "${message}" ? Ça me rappelle mes années rebelles. Quel est ton prochain défi ?`
      ],
      'Toi à 30 ans': [
        `Hmm, "${message}" ? En tant que ton toi à 30 ans, je te conseille de rester focus !`,
        `À 30 ans, je bosse dur pour mes rêves. Et toi, quel est ton plan ?`,
        `Bonne question ! Je dirais de ne pas lâcher face à "${message}". Des idées ?`
      ],
      'Toi à 60 ans': [
        `Avec l'expérience, "${message}" me fait dire : patience et sagesse ! Ton avis ?`,
        `À 60 ans, je sais que la vie est un marathon. Comment gères-tu "${message}" ?`,
        `La vie m'a appris à prioriser le bonheur. Que penses-tu de "${message}" ?`
      ],
      'Toi Parallèle Succès': [
        `Dans ma réalité, "${message}" m'a mené au succès. Quels sont tes objectifs pro ?`,
        `Le succès demande du focus face à "${message}". Sur quoi travailles-tu ?`,
        `Bonne réflexion ! "${message}" me rappelle mes choix gagnants. Et toi ?`
      ],
      'Toi Parallèle Zen': [
        `Face à "${message}", je te dirais de respirer profondément. Ça aide !`,
        `La paix intérieure change tout pour "${message}". Tu pratiques la méditation ?`,
        `Hmm, "${message}" ? Restons calmes et trouvons une solution ensemble.`
      ],
      default: [
        `C'est une super question : "${message}" ! Laisse-moi y réfléchir...`,
        `Intéressant, "${message}" ? Voici ce que je pense...`,
        `Wow, "${message}" ? Ça mérite une réponse bien pensée !`
      ]
    };

    const responses = personality?.name && responsesByPersonality[personality.name]
      ? responsesByPersonality[personality.name]
      : responsesByPersonality.default;

    return responses[Math.floor(Math.random() * responses.length)];
  }
}