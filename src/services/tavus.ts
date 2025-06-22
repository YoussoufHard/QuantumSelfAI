import toast from 'react-hot-toast';
import * as Sentry from '@sentry/react';

/**
 * Interface for Tavus Avatar
 * @interface TavusAvatar
 */
export interface TavusAvatar {
  id: string;
  name: string;
  status: 'processing' | 'ready' | 'error';
  video_url?: string;
  thumbnail_url?: string;
}

/**
 * Interface for Tavus Video
 * @interface TavusVideo
 */
export interface TavusVideo {
  id: string;
  status: 'processing' | 'completed' | 'error';
  download_url?: string;
  thumbnail_url?: string;
}

/**
 * Service class for handling Tavus API interactions
 * @class TavusService
 */
export class TavusService {
  private static readonly API_KEY = import.meta.env.VITE_TAVUS_API_KEY;
  private static readonly BASE_URL = 'https://tavusapi.com/v2';
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly VALID_IMAGE_TYPES = ['image/jpeg', 'image/png'];
  private static readonly MAX_SCRIPT_LENGTH = 1000;
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
   * Validates a script
   * @private
   * @param script - The script to validate
   * @returns {{ valid: boolean; message?: string }} Validation result
   */
  private static validateScript(script: string): { valid: boolean; message?: string } {
    if (!script?.trim()) {
      return { valid: false, message: 'Le script ne peut pas être vide' };
    }
    if (script.length > this.MAX_SCRIPT_LENGTH) {
      return { valid: false, message: `Le script ne peut pas dépasser ${this.MAX_SCRIPT_LENGTH} caractères` };
    }
    if (script.length < 10) {
      return { valid: false, message: 'Le script doit contenir au moins 10 caractères' };
    }
    return { valid: true };
  }

  /**
   * Checks if API key is configured
   * @private
   * @returns {boolean} True if API key is valid
   */
  private static isApiConfigured(): boolean {
    if (!this.API_KEY || this.API_KEY === 'your_tavus_api_key_here') {
      console.warn('❌ Tavus API key not configured');
      toast.error('❌ Tavus API key missing');
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
          'x-api-key': this.API_KEY,
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
   * Creates a new avatar
   * @param imageFile - The image file for training
   * @param name - The name of the avatar
   * @returns {Promise<string>} The avatar ID
   */
  static async createAvatar(imageFile: File, name: string): Promise<string> {
    return this.queueRequest(async () => {
      try {
        this.validateImageFile(imageFile);
        if (!name?.trim()) {
          throw new Error('Avatar name cannot be empty');
        }

        if (!this.isApiConfigured() || !(await this.checkQuota())) {
          console.warn('Mode simulation - Avatar creation simulated');
          toast('🎬 Simulation mode - Avatar creation');
          return `demo-avatar-${Date.now()}`;
        }

        const formData = new FormData();
        formData.append('training_data', imageFile);
        formData.append('avatar_name', `${name}_quantum_avatar`);
        formData.append('callback_url', `${window.location.origin}/api/tavus-webhook`);

        const response = await fetch(`${this.BASE_URL}/avatars`, {
          method: 'POST',
          headers: {
            'x-api-key': this.API_KEY,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Tavus error: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        toast.success('🎬 Avatar creation started!');
        return data.avatar_id;
      } catch (error: any) {
        let message = 'Error creating avatar';
        if (error.message.includes('401')) message = 'Invalid API key';
        else if (error.message.includes('429')) message = 'Quota limit reached';
        else if (error.message.includes('400')) message = 'Invalid input';

        Sentry.captureException(error);
        console.error(`${message}:`, error);
        toast.error(`🎬 ${message}, using simulation mode`);
        return `demo-avatar-${Date.now()}`;
      }
    });
  }

  /**
   * Generates a video for an avatar
   * @param avatarId - The avatar ID
   * @param script - The script for the video
   * @param background - The background setting
   * @returns {Promise<string>} The video ID
   */
  static async generateVideo(avatarId: string, script: string, background: string = 'office'): Promise<string> {
    return this.queueRequest(async () => {
      try {
        if (!avatarId?.trim()) {
          throw new Error('Avatar ID cannot be empty');
        }
        const scriptValidation = this.validateScript(script);
        if (!scriptValidation.valid) {
          throw new Error(scriptValidation.message);
        }

        if (!this.isApiConfigured() || !(await this.checkQuota())) {
          console.warn('Mode simulation - Video generation simulated');
          toast('🎥 Simulation mode - Video generation');
          return `demo-video-${Date.now()}`;
        }

        const response = await fetch(`${this.BASE_URL}/videos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.API_KEY,
          },
          body: JSON.stringify({
            avatar_id: avatarId,
            script: script.substring(0, this.MAX_SCRIPT_LENGTH),
            background,
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8,
              style: 0.2,
              use_speaker_boost: true,
            },
            video_settings: {
              quality: 'high',
              format: 'mp4',
              resolution: '1920x1080',
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Tavus error: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        toast.success('🎥 Video generation started!');
        return data.video_id;
      } catch (error: any) {
        let message = 'Error generating video';
        if (error.message.includes('401')) message = 'Invalid API key';
        else if (error.message.includes('429')) message = 'Quota limit reached';
        else if (error.message.includes('400')) message = 'Invalid input';

        Sentry.captureException(error);
        console.error(`${message}:`, error);
        toast.error(`🎥 ${message}, using simulation mode`);
        return `demo-video-${Date.now()}`;
      }
    });
  }

  /**
   * Gets the status of a video
   * @param videoId - The video ID
   * @returns {Promise<TavusVideo>} The video status
   */
  static async getVideoStatus(videoId: string): Promise<TavusVideo> {
    return this.queueRequest(async () => {
      try {
        if (!videoId?.trim()) {
          throw new Error('Video ID cannot be empty');
        }

        if (!this.isApiConfigured() || videoId.startsWith('demo-') || !(await this.checkQuota())) {
          console.warn('Mode simulation - Video status simulated');
          return this.getSimulatedVideo(videoId);
        }

        const response = await fetch(`${this.BASE_URL}/videos/${videoId}`, {
          headers: {
            'x-api-key': this.API_KEY,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Tavus error: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const result: TavusVideo = {
          id: data.video_id,
          status: data.status,
          download_url: data.download_url,
          thumbnail_url: data.thumbnail_url,
        };

        return result;
      } catch (error: any) {
        let message = 'Error retrieving video status';
        if (error.message.includes('401')) message = 'Invalid API key';
        else if (error.message.includes('429')) message = 'Quota limit reached';
        else if (error.message.includes('400')) message = 'Invalid video ID';

        Sentry.captureException(error);
        console.error(`${message}:`, error);
        toast.error(`🎥 ${message}, using simulation mode`);
        return this.getSimulatedVideo(videoId);
      }
    });
  }

  /**
   * Gets the status of an avatar
   * @param avatarId - The avatar ID
   * @returns {Promise<TavusAvatar>} The avatar status
   */
  static async getAvatarStatus(avatarId: string): Promise<TavusAvatar> {
    return this.queueRequest(async () => {
      try {
        if (!avatarId?.trim()) {
          throw new Error('Avatar ID cannot be empty');
        }

        if (!this.isApiConfigured() || avatarId.startsWith('demo-') || !(await this.checkQuota())) {
          console.warn('Mode simulation - Avatar status simulated');
          return this.getSimulatedAvatar(avatarId);
        }

        const response = await fetch(`${this.BASE_URL}/avatars/${avatarId}`, {
          headers: {
            'x-api-key': this.API_KEY,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Tavus error: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const result: TavusAvatar = {
          id: data.avatar_id,
          name: data.avatar_name,
          status: data.status,
          video_url: data.video_url,
          thumbnail_url: data.thumbnail_url,
        };

        return result;
      } catch (error: any) {
        let message = 'Error retrieving avatar status';
        if (error.message.includes('401')) message = 'Invalid API key';
        else if (error.message.includes('429')) message = 'Quota limit reached';
        else if (error.message.includes('400')) message = 'Invalid avatar ID';

        Sentry.captureException(error);
        console.error(`${message}:`, error);
        toast.error(`🎬 ${message}, using simulation mode`);
        return this.getSimulatedAvatar(avatarId);
      }
    });
  }

  /**
   * Lists all available avatars
   * @returns {Promise<TavusAvatar[]>} Array of avatars
   */
  static async listAvatars(): Promise<TavusAvatar[]> {
    return this.queueRequest(async () => {
      try {
        if (!this.isApiConfigured() || !(await this.checkQuota())) {
          console.warn('Mode simulation - Avatar list simulated');
          return this.getSimulatedAvatarList();
        }

        const response = await fetch(`${this.BASE_URL}/avatars`, {
          headers: {
            'x-api-key': this.API_KEY,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Tavus error: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        return data.avatars || [];
      } catch (error: any) {
        let message = 'Error listing avatars';
        if (error.message.includes('401')) message = 'Invalid API key';
        else if (error.message.includes('429')) message = 'Quota limit reached';

        Sentry.captureException(error);
        console.error(`${message}:`, error);
        toast.error(`🎬 ${message}, using simulation mode`);
        return this.getSimulatedAvatarList();
      }
    });
  }

  /**
   * Deletes an avatar
   * @param avatarId - The avatar ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  static async deleteAvatar(avatarId: string): Promise<boolean> {
    return this.queueRequest(async () => {
      try {
        if (!avatarId?.trim()) {
          throw new Error('Avatar ID cannot be empty');
        }

        if (!this.isApiConfigured() || avatarId.startsWith('demo-') || !(await this.checkQuota())) {
          console.warn('Mode simulation - Avatar deletion simulated');
          toast.success('🗑️ Avatar deleted (simulation)');
          return true;
        }

        const response = await fetch(`${this.BASE_URL}/avatars/${avatarId}`, {
          method: 'DELETE',
          headers: {
            'x-api-key': this.API_KEY,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Tavus error: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }

        toast.success('🗑️ Avatar deleted successfully!');
        return true;
      } catch (error: any) {
        let message = 'Error deleting avatar';
        if (error.message.includes('401')) message = 'Invalid API key';
        else if (error.message.includes('429')) message = 'Quota limit reached';
        else if (error.message.includes('400')) message = 'Invalid avatar ID';

        Sentry.captureException(error);
        console.error(`${message}:`, error);
        toast.error(`🗑️ ${message}`);
        return false;
      }
    });
  }

  /**
   * Deletes a video
   * @param videoId - The video ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  static async deleteVideo(videoId: string): Promise<boolean> {
    return this.queueRequest(async () => {
      try {
        if (!videoId?.trim()) {
          throw new Error('Video ID cannot be empty');
        }

        if (!this.isApiConfigured() || videoId.startsWith('demo-') || !(await this.checkQuota())) {
          console.warn('Mode simulation - Video deletion simulated');
          toast.success('🗑️ Video deleted (simulation)');
          return true;
        }

        const response = await fetch(`${this.BASE_URL}/videos/${videoId}`, {
          method: 'DELETE',
          headers: {
            'x-api-key': this.API_KEY,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Tavus error: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }

        toast.success('🗑️ Video deleted successfully!');
        return true;
      } catch (error: any) {
        let message = 'Error deleting video';
        if (error.message.includes('401')) message = 'Invalid API key';
        else if (error.message.includes('429')) message = 'Quota limit reached';
        else if (error.message.includes('400')) message = 'Invalid video ID';

        Sentry.captureException(error);
        console.error(`${message}:`, error);
        toast.error(`🗑️ ${message}`);
        return false;
      }
    });
  }

  /**
   * Returns simulated video status
   * @private
   * @param videoId - The video ID
   * @returns {TavusVideo} Simulated video
   */
  private static getSimulatedVideo(videoId: string): TavusVideo {
    return {
      id: videoId,
      status: Math.random() > 0.3 ? 'completed' : 'processing',
      download_url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      thumbnail_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    };
  }

  /**
   * Returns simulated avatar status
   * @private
   * @param avatarId - The avatar ID
   * @returns {TavusAvatar} Simulated avatar
   */
  private static getSimulatedAvatar(avatarId: string): TavusAvatar {
    return {
      id: avatarId,
      name: `Quantum Avatar ${avatarId.split('-').pop()}`,
      status: Math.random() > 0.3 ? 'ready' : 'processing',
      video_url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      thumbnail_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    };
  }

  /**
   * Returns simulated avatar list
   * @private
   * @returns {TavusAvatar[]} Simulated avatar list
   */
  private static getSimulatedAvatarList(): TavusAvatar[] {
    return [
      {
        id: `demo-avatar-${Date.now()}`,
        name: 'Quantum Avatar 1',
        status: 'ready',
        video_url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnail_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      },
      {
        id: `demo-avatar-${Date.now() + 1}`,
        name: 'Quantum Avatar 2',
        status: 'processing',
      },
    ];
  }

  /**
   * Returns available background options
   * @returns {Array<{value: string, label: string}>} Background options
   */
  static getBackgroundOptions(): Array<{ value: string; label: string }> {
    return [
      { value: 'office', label: 'Bureau moderne' },
      { value: 'home', label: 'Maison confortable' },
      { value: 'studio', label: 'Studio professionnel' },
      { value: 'outdoor', label: 'Extérieur naturel' },
      { value: 'abstract', label: 'Arrière-plan abstrait' },
      { value: 'vibrant_youth', label: 'Jeunesse vibrante' },
      { value: 'serene_wisdom', label: 'Sagesse sereine' },
      { value: 'creative_space', label: 'Espace créatif' },
    ];
  }

  /**
   * Returns available quality options
   * @returns {Array<{value: string, label: string}>} Quality options
   */
  static getQualityOptions(): Array<{ value: string; label: string }> {
    return [
      { value: 'standard', label: 'Standard (720p)' },
      { value: 'high', label: 'Haute (1080p)' },
      { value: 'ultra', label: 'Ultra (4K)' },
    ];
  }
}