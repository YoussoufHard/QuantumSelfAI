export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          name: string
          avatar_url: string | null
          profile_photo: string | null
          audio_sample: string | null
          voice_clone_id: string | null
          onboarding_complete: boolean
          language: string
          timezone: string
          questionnaire: Json
          pica_analysis: Json
          personality_profile: Json
          is_premium: boolean
          subscription_status: string
          subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          name: string
          avatar_url?: string | null
          profile_photo?: string | null
          audio_sample?: string | null
          voice_clone_id?: string | null
          onboarding_complete?: boolean
          language?: string
          timezone?: string
          questionnaire?: Json
          pica_analysis?: Json
          personality_profile?: Json
          is_premium?: boolean
          subscription_status?: string
          subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          name?: string
          avatar_url?: string | null
          profile_photo?: string | null
          audio_sample?: string | null
          voice_clone_id?: string | null
          onboarding_complete?: boolean
          language?: string
          timezone?: string
          questionnaire?: Json
          pica_analysis?: Json
          personality_profile?: Json
          is_premium?: boolean
          subscription_status?: string
          subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quantum_versions: {
        Row: {
          id: string
          user_id: string
          name: string
          age: number
          type: 'past' | 'present' | 'future' | 'parallel'
          description: string | null
          color: string
          icon: string
          personality: string[]
          system_prompt: string | null
          traits: string[]
          communication_style: string | null
          is_active: boolean
          is_premium: boolean
          compatibility_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          age: number
          type: 'past' | 'present' | 'future' | 'parallel'
          description?: string | null
          color?: string
          icon?: string
          personality?: string[]
          system_prompt?: string | null
          traits?: string[]
          communication_style?: string | null
          is_active?: boolean
          is_premium?: boolean
          compatibility_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          age?: number
          type?: 'past' | 'present' | 'future' | 'parallel'
          description?: string | null
          color?: string
          icon?: string
          personality?: string[]
          system_prompt?: string | null
          traits?: string[]
          communication_style?: string | null
          is_active?: boolean
          is_premium?: boolean
          compatibility_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          version_id: string
          title: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          version_id: string
          title?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          version_id?: string
          title?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          content: string
          sender: 'user' | 'quantum'
          audio_url: string | null
          video_url: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          content: string
          sender: 'user' | 'quantum'
          audio_url?: string | null
          video_url?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          content?: string
          sender?: 'user' | 'quantum'
          audio_url?: string | null
          video_url?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      insights: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          category: 'motivation' | 'wisdom' | 'opportunity'
          from_version: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          category: 'motivation' | 'wisdom' | 'opportunity'
          from_version?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          category?: 'motivation' | 'wisdom' | 'opportunity'
          from_version?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          audio_enabled: boolean
          video_enabled: boolean
          notifications_enabled: boolean
          daily_reminder: boolean
          reminder_time: string
          theme: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          audio_enabled?: boolean
          video_enabled?: boolean
          notifications_enabled?: boolean
          daily_reminder?: boolean
          reminder_time?: string
          theme?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          audio_enabled?: boolean
          video_enabled?: boolean
          notifications_enabled?: boolean
          daily_reminder?: boolean
          reminder_time?: string
          theme?: string
          created_at?: string
          updated_at?: string
        }
      }
      emotional_weather: {
        Row: {
          id: string
          user_id: string
          mood: 'sunny' | 'cloudy' | 'stormy' | 'rainbow'
          energy: number | null
          stress: number | null
          motivation: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood: 'sunny' | 'cloudy' | 'stormy' | 'rainbow'
          energy?: number | null
          stress?: number | null
          motivation?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood?: 'sunny' | 'cloudy' | 'stormy' | 'rainbow'
          energy?: number | null
          stress?: number | null
          motivation?: number | null
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}