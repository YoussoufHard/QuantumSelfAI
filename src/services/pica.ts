import toast from 'react-hot-toast';
import * as Sentry from '@sentry/react';

/**
 * Interface for Pica AI analysis result
 * @interface PicaAnalysis
 */
export interface PicaAnalysis {
  faceDetected: boolean;
  emotionalState: string;
  ageEstimate: number;
  personalityTraits: string[];
  confidence: number;
  biometricScore: number;
}

/**
 * Service class for handling Pica AI API interactions
 * @class PicaService
 */
export class PicaService {
  private static readonly API_KEY = import.meta.env.VITE_PICA_API_KEY;
  private static readonly BASE_URL = 'https://api.pica-ai.com/v1';
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly VALID_IMAGE_TYPES = ['image/jpeg', 'image/png'];
  private static requestQueue: Promise<any> = Promise.resolve();

  /**
   * Validates an image file
   * @private
   * @param file - The image file to validate
   * @throws {Error} If the file is invalid
   */
  private static validateImageFile(file: File): void {
    if (!file) {
      throw new Error('No image file provided');
    }
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`Image file too large (max ${this.MAX_FILE_SIZE / 1024 / 1024}MB)`);
    }
    if (!this.VALID_IMAGE_TYPES.includes(file.type)) {
      throw new Error('Invalid image format (JPEG or PNG required)');
    }
  }

  /**
   * Checks if API key is configured
   * @private
   * @returns {boolean} True if API key is valid
   */
  private static isApiConfigured(): boolean {
    if (!this.API_KEY || this.API_KEY === 'your_pica_api_key_here') {
      console.warn('❌ Pica API key not configured');
      toast.error('❌ Pica API key missing');
      return false;
    }
    return true;
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
    if (!this.isApiConfigured()) return false;

    try {
      // Hypothetical quota check via test request
      const response = await fetch(`${this.BASE_URL}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
        },
      });
      return response.ok;
    } catch (error) {
      Sentry.captureException(error);
      console.warn('Quota check failed:', error);
      return false;
    }
  }

  /**
   * Analyzes a face from an image file
   * @param imageFile - The image file to analyze
   * @returns {Promise<PicaAnalysis>} The analysis result
   */
  static async analyzeFace(imageFile: File): Promise<PicaAnalysis> {
    return this.queueRequest(async () => {
      try {
        this.validateImageFile(imageFile);

        if (!this.isApiConfigured() || !(await this.checkQuota())) {
          console.warn('Mode simulation - Biometric analysis simulated');
          toast('🔍 Simulation mode - Biometric analysis');
          return this.getSimulatedAnalysis();
        }

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('features', 'emotion,age,personality,face_detection');

        const response = await fetch(`${this.BASE_URL}/analyze`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Pica AI error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const result: PicaAnalysis = {
          faceDetected: data.face_detected ?? true,
          emotionalState: data.emotion?.dominant ?? 'confident',
          ageEstimate: data.age?.estimate ?? 28,
          personalityTraits: data.personality?.traits ?? ['creative', 'determined', 'empathetic'],
          confidence: data.confidence ?? 0.95,
          biometricScore: data.biometric_score ?? 0.92,
        };

        toast.success('🔍 Face analysis completed successfully!');
        return result;
      } catch (error: any) {
        let message = 'Error analyzing face';
        if (error.message.includes('401')) message = 'Invalid API key';
        else if (error.message.includes('429')) message = 'Quota limit reached';
        else if (error.message.includes('400')) message = 'Invalid image file';

        Sentry.captureException(error);
        console.error(`${message}:`, error);
        toast.error(`🔍 ${message}, using simulation mode`);
        return this.getSimulatedAnalysis();
      }
    });
  }

  /**
   * Enhances an image file
   * @param imageFile - The image file to enhance
   * @returns {Promise<Blob>} The enhanced image
   */
  static async enhanceImage(imageFile: File): Promise<Blob> {
    return this.queueRequest(async () => {
      try {
        this.validateImageFile(imageFile);

        if (!this.isApiConfigured() || !(await this.checkQuota())) {
          console.warn('Mode simulation - Image enhancement simulated');
          toast('🖼️ Simulation mode - Image enhancement');
          return imageFile;
        }

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('enhancement', 'face_enhance,lighting,quality');

        const response = await fetch(`${this.BASE_URL}/enhance`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Pica AI error: ${response.status} - ${errorText}`);
        }

        const enhancedImage = await response.blob();
        if (enhancedImage.size === 0) {
          throw new Error('Enhanced image is empty');
        }

        toast.success('🖼️ Image enhanced successfully!');
        return enhancedImage;
      } catch (error: any) {
        let message = 'Error enhancing image';
        if (error.message.includes('401')) message = 'Invalid API key';
        else if (error.message.includes('429')) message = 'Quota limit reached';
        else if (error.message.includes('400')) message = 'Invalid image file';

        Sentry.captureException(error);
        console.error(`${message}:`, error);
        toast.error(`🖼️ ${message}, returning original image`);
        return imageFile;
      }
    });
  }

  /**
   * Generates avatar variations with age modifications
   * @param imageFile - The base image file
   * @param ageModifications - Array of age modification values
   * @returns {Promise<Blob[]>} Array of avatar variations
   */
  static async generateAvatarVariations(imageFile: File, ageModifications: number[]): Promise<Blob[]> {
    return this.queueRequest(async () => {
      try {
        this.validateImageFile(imageFile);
        if (!ageModifications?.length) {
          throw new Error('No age modifications provided');
        }

        if (!this.isApiConfigured() || !(await this.checkQuota())) {
          console.warn('Mode simulation - Avatar variations simulated');
          toast('🎭 Simulation mode - Avatar variations');
          return ageModifications.map(() => imageFile);
        }

        const variations: Blob[] = [];

        for (const ageModification of ageModifications) {
          const formData = new FormData();
          formData.append('image', imageFile);
          formData.append('age_modification', ageModification.toString());
          formData.append('style', 'realistic');

          const response = await fetch(`${this.BASE_URL}/age-modify`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.API_KEY}`,
            },
            body: formData,
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Pica AI error: ${response.status} - ${errorText}`);
          }

          const variation = await response.blob();
          if (variation.size === 0) {
            console.warn('Empty variation generated, using original image');
            variations.push(imageFile);
          } else {
            variations.push(variation);
          }
        }

        toast.success('🎭 Avatar variations generated successfully!');
        return variations;
      } catch (error: any) {
        let message = 'Error generating avatar variations';
        if (error.message.includes('401')) message = 'Invalid API key';
        else if (error.message.includes('429')) message = 'Quota limit reached';
        else if (error.message.includes('400')) message = 'Invalid image file';

        Sentry.captureException(error);
        console.error(`${message}:`, error);
        toast.error(`🎭 ${message}, returning original images`);
        return ageModifications.map(() => imageFile);
      }
    });
  }

  /**
   * Generates a simulated analysis result
   * @private
   * @returns {PicaAnalysis} Simulated analysis
   */
  private static getSimulatedAnalysis(): PicaAnalysis {
    const ageEstimate = 25 + Math.floor(Math.random() * 15);
    return {
      faceDetected: Math.random() > 0.1, // 90% chance of face detection
      emotionalState: this.getRandomEmotion(ageEstimate),
      ageEstimate,
      personalityTraits: this.getRandomTraits(ageEstimate),
      confidence: 0.85 + Math.random() * 0.15,
      biometricScore: 0.88 + Math.random() * 0.12,
    };
  }

  /**
   * Returns a random emotion based on age
   * @private
   * @param ageEstimate - The estimated age
   * @returns {string} Random emotion
   */
  private static getRandomEmotion(ageEstimate: number): string {
    const youngEmotions = ['confident', 'happy', 'optimistic', 'energetic'];
    const adultEmotions = ['calm', 'focused', 'determined', 'content'];
    const olderEmotions = ['wise', 'serene', 'reflective', 'grateful'];

    let emotions: string[];
    if (ageEstimate < 25) emotions = youngEmotions;
    else if (ageEstimate < 50) emotions = adultEmotions;
    else emotions = olderEmotions;

    return emotions[Math.floor(Math.random() * emotions.length)];
  }

  /**
   * Returns random personality traits based on age
   * @private
   * @param ageEstimate - The estimated age
   * @returns {string[]} Random traits
   */
  private static getRandomTraits(ageEstimate: number): string[] {
    const youngTraits = ['creative', 'curious', 'adventurous', 'energetic'];
    const adultTraits = ['analytical', 'determined', 'empathetic', 'reliable'];
    const olderTraits = ['wise', 'thoughtful', 'patient', 'intuitive'];

    let baseTraits: string[];
    if (ageEstimate < 25) baseTraits = youngTraits;
    else if (ageEstimate < 50) baseTraits = adultTraits;
    else baseTraits = olderTraits;

    const numTraits = 3 + Math.floor(Math.random() * 2);
    const shuffled = [...baseTraits, 'optimistic', 'innovative'].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numTraits);
  }
}