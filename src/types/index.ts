export interface User {
  id: string;
  name: string;
  email?: string;
  profilePhoto?: string;
  audioSample?: string;
  onboardingComplete: boolean;
  selectedVersions: QuantumVersion[];
  questionnaire?: QuestionnaireAnswers;
  picaAnalysis?: PicaAnalysis;
  personalityProfile?: PersonalityProfile;
}

export interface QuantumVersion {
  id: string;
  name: string;
  age: number;
  type: 'past' | 'present' | 'future' | 'parallel';
  description: string;
  color: string;
  icon: string;
  personality: string[];
}

export interface QuestionnaireAnswers {
  dreams?: string;
  regrets?: string;
  goals?: string;
  fears?: string;
  motivation?: string;
  values?: string;
  success?: string;
  relationships?: string;
  growth?: string;
  legacy?: string;
  happiness?: string;
}

export interface PicaAnalysis {
  faceDetected: boolean;
  emotionalState: string;
  ageEstimate: number;
  personalityTraits: string[];
}

export interface PersonalityProfile {
  coreTraits: string[];
  communicationStyle: string;
  decisionMaking: string;
  stressResponse: string;
  motivationDrivers: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'quantum';
  versionId: string;
}

export interface Insight {
  id: string;
  title: string;
  content: string;
  category: 'motivation' | 'wisdom' | 'opportunity';
  timestamp: Date;
  fromVersion: string;
}

export interface EmotionalWeather {
  mood: 'sunny' | 'cloudy' | 'stormy' | 'rainbow';
  energy: number;
  stress: number;
  motivation: number;
  timestamp: Date;
}

export interface ConversationAnalytics {
  totalConversations: number;
  averageSessionLength: number;
  mostActiveVersion: string;
  insightsReceived: number;
  emotionalTrends: EmotionalWeather[];
}