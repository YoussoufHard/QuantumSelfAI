import { supabase } from '../lib/supabase';
import type { 
  AuthUser, 
  QuantumVersion, 
  Conversation, 
  Message, 
  Insight, 
  UserSettings, 
  EmotionalWeather 
} from '../lib/supabase';
import toast from 'react-hot-toast';

/**
 * Service pour la gestion de la base de données
 */
export class DatabaseService {
  
  // ===== PROFILS UTILISATEURS =====
  
  static async getUserProfile(userId: string): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur récupération profil:', error);
      return null;
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<AuthUser>): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur mise à jour profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
      return null;
    }
  }

  // ===== VERSIONS QUANTIQUES =====
  
  static async getUserQuantumVersions(userId: string): Promise<QuantumVersion[]> {
    try {
      const { data, error } = await supabase
        .from('quantum_versions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Erreur récupération versions quantiques:', error);
      return [];
    }
  }

  static async createQuantumVersion(version: Omit<QuantumVersion, 'id' | 'created_at' | 'updated_at'>): Promise<QuantumVersion | null> {
    try {
      const { data, error } = await supabase
        .from('quantum_versions')
        .insert(version)
        .select()
        .single();

      if (error) throw error;
      toast.success('Version quantique créée !');
      return data;
    } catch (error: any) {
      console.error('Erreur création version quantique:', error);
      toast.error('Erreur lors de la création de la version');
      return null;
    }
  }

  static async updateQuantumVersion(versionId: string, updates: Partial<QuantumVersion>): Promise<QuantumVersion | null> {
    try {
      const { data, error } = await supabase
        .from('quantum_versions')
        .update(updates)
        .eq('id', versionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur mise à jour version quantique:', error);
      return null;
    }
  }

  static async deleteQuantumVersion(versionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quantum_versions')
        .update({ is_active: false })
        .eq('id', versionId);

      if (error) throw error;
      toast.success('Version quantique supprimée');
      return true;
    } catch (error: any) {
      console.error('Erreur suppression version quantique:', error);
      toast.error('Erreur lors de la suppression');
      return false;
    }
  }

  // ===== CONVERSATIONS =====
  
  static async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          quantum_versions (name, color, icon),
          messages (id, content, sender, created_at)
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Erreur récupération conversations:', error);
      return [];
    }
  }

  static async createConversation(conversation: Omit<Conversation, 'id' | 'created_at' | 'updated_at'>): Promise<Conversation | null> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert(conversation)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur création conversation:', error);
      return null;
    }
  }

  static async getConversationMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Erreur récupération messages:', error);
      return [];
    }
  }

  static async addMessage(message: Omit<Message, 'id' | 'created_at'>): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur ajout message:', error);
      return null;
    }
  }

  // ===== INSIGHTS =====
  
  static async getUserInsights(userId: string, limit: number = 10): Promise<Insight[]> {
    try {
      const { data, error } = await supabase
        .from('insights')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Erreur récupération insights:', error);
      return [];
    }
  }

  static async createInsight(insight: Omit<Insight, 'id' | 'created_at'>): Promise<Insight | null> {
    try {
      const { data, error } = await supabase
        .from('insights')
        .insert(insight)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur création insight:', error);
      return null;
    }
  }

  static async markInsightAsRead(insightId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('insights')
        .update({ is_read: true })
        .eq('id', insightId);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Erreur marquage insight lu:', error);
      return false;
    }
  }

  // ===== PARAMÈTRES UTILISATEUR =====
  
  static async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur récupération paramètres:', error);
      return null;
    }
  }

  static async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<UserSettings | null> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .upsert({ user_id: userId, ...settings })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur mise à jour paramètres:', error);
      return null;
    }
  }

  // ===== MÉTÉO ÉMOTIONNELLE =====
  
  static async getEmotionalWeather(userId: string, days: number = 7): Promise<EmotionalWeather[]> {
    try {
      const { data, error } = await supabase
        .from('emotional_weather')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Erreur récupération météo émotionnelle:', error);
      return [];
    }
  }

  static async addEmotionalWeather(weather: Omit<EmotionalWeather, 'id' | 'created_at'>): Promise<EmotionalWeather | null> {
    try {
      const { data, error } = await supabase
        .from('emotional_weather')
        .insert(weather)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur ajout météo émotionnelle:', error);
      return null;
    }
  }

  // ===== ANALYTICS =====
  
  static async getUserAnalytics(userId: string): Promise<any> {
    try {
      // Récupérer les statistiques de l'utilisateur
      const [conversations, messages, insights, emotionalWeather] = await Promise.all([
        this.getUserConversations(userId),
        supabase.from('messages').select('*').eq('user_id', userId),
        this.getUserInsights(userId, 100),
        this.getEmotionalWeather(userId, 30),
      ]);

      const totalConversations = conversations.length;
      const totalMessages = messages.data?.length || 0;
      const totalInsights = insights.length;
      
      // Calculer la version la plus active
      const versionStats = conversations.reduce((acc: any, conv) => {
        const versionName = conv.quantum_versions?.name || 'Unknown';
        acc[versionName] = (acc[versionName] || 0) + 1;
        return acc;
      }, {});
      
      const mostActiveVersion = Object.entries(versionStats)
        .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'Aucune';

      return {
        totalConversations,
        totalMessages,
        totalInsights,
        mostActiveVersion,
        emotionalTrends: emotionalWeather,
        conversationsThisMonth: conversations.filter(c => 
          new Date(c.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
      };
    } catch (error: any) {
      console.error('Erreur récupération analytics:', error);
      return {
        totalConversations: 0,
        totalMessages: 0,
        totalInsights: 0,
        mostActiveVersion: 'Aucune',
        emotionalTrends: [],
        conversationsThisMonth: 0,
      };
    }
  }

  // ===== RECHERCHE =====
  
  static async searchConversations(userId: string, query: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          conversations (
            id,
            title,
            quantum_versions (name, color, icon)
          )
        `)
        .eq('user_id', userId)
        .textSearch('content', query)
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Erreur recherche conversations:', error);
      return [];
    }
  }

  // ===== EXPORT DE DONNÉES =====
  
  static async exportUserData(userId: string): Promise<any> {
    try {
      const [profile, versions, conversations, insights, settings] = await Promise.all([
        this.getUserProfile(userId),
        this.getUserQuantumVersions(userId),
        this.getUserConversations(userId),
        this.getUserInsights(userId, 1000),
        this.getUserSettings(userId),
      ]);

      return {
        profile,
        quantumVersions: versions,
        conversations,
        insights,
        settings,
        exportDate: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('Erreur export données:', error);
      throw error;
    }
  }
}