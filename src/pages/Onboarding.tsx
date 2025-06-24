import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  Mic,
  MicOff,
  ChevronLeft,
  ChevronRight,
  Check,
  Brain,
  Camera,
  Sparkles,
  Eye,
  RotateCcw,
  Zap,
  SkipForward,
  Wand2,
  Scan,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import VersionCard from '../components/VersionCard';
import { QuantumVersion } from '../types';
import { PicaService } from '../services/pica';
import { ElevenLabsService } from '../services/elevenlabs';
import AudioPlayer from '../components/AudioPlayer';
import toast from 'react-hot-toast';
import * as Sentry from '@sentry/react';

const quantumVersions: QuantumVersion[] = [
  {
    id: 'young-self',
    name: 'Toi à 16 ans',
    age: 16,
    type: 'past',
    description: 'Plein d\'énergie et de rêves',
    color: 'blue',
    icon: 'star',
    personality: ['optimiste', 'curieux', 'audacieux']
  },
  {
    id: 'present-self',
    name: 'Toi à 30 ans',
    age: 30,
    type: 'present',
    description: 'Présent optimisé et équilibré',
    color: 'emerald',
    icon: 'zap',
    personality: ['équilibré', 'efficace', 'centré']
  },
  {
    id: 'wise-self',
    name: 'Toi à 60 ans',
    age: 60,
    type: 'future',
    description: 'Sage et expérimenté',
    color: 'amber',
    icon: 'crown',
    personality: ['sage', 'patient', 'bienveillant']
  },
  {
    id: 'success-self',
    name: 'Toi Parallèle Success',
    age: 35,
    type: 'parallel',
    description: 'Qui a réalisé tous ses rêves',
    color: 'purple',
    icon: 'trophy',
    personality: ['ambitieux', 'déterminé', 'inspirant']
  },
  {
    id: 'zen-self',
    name: 'Toi Parallèle Zen',
    age: 40,
    type: 'parallel',
    description: 'Parfaitement équilibré et serein',
    color: 'pink',
    icon: 'sparkles',
    personality: ['serein', 'harmonieux', 'épanoui']
  }
];

const psychologyQuestions = [
  {
    id: 'dreams',
    question: 'Quel est ton plus grand rêve ou aspiration dans la vie ?',
    placeholder: 'Décris ce qui te fait vibrer le plus...',
    category: 'aspirations'
  },
  {
    id: 'fears',
    question: 'Quelle est ta plus grande peur ou préoccupation actuellement ?',
    placeholder: 'Partage ce qui t\'inquiète le plus...',
    category: 'challenges'
  },
  {
    id: 'values',
    question: 'Quelles sont les 3 valeurs les plus importantes pour toi ?',
    placeholder: 'Ex: famille, créativité, liberté...',
    category: 'core'
  },
  {
    id: 'regrets',
    question: 'Y a-t-il quelque chose que tu regrettes ou que tu ferais différemment ?',
    placeholder: 'Réflexion sur ton parcours...',
    category: 'reflection'
  },
  {
    id: 'motivation',
    question: 'Qu\'est-ce qui te motive le plus à se lever chaque matin ?',
    placeholder: 'Ta source d\'énergie principale...',
    category: 'drive'
  },
  {
    id: 'success',
    question: 'Comment définis-tu le succès dans ta vie ?',
    placeholder: 'Ta vision personnelle du succès...',
    category: 'definition'
  },
  {
    id: 'relationships',
    question: 'Quel type de relations veux-tu cultiver dans ta vie ?',
    placeholder: 'Famille, amis, partenaires, collègues...',
    category: 'social'
  },
  {
    id: 'growth',
    question: 'Dans quel domaine aimerais-tu le plus progresser cette année ?',
    placeholder: 'Personnel, professionnel, spirituel...',
    category: 'development'
  },
  {
    id: 'legacy',
    question: 'Quel héritage ou impact veux-tu laisser derrière toi ?',
    placeholder: 'Comment veux-tu être rappelé...',
    category: 'purpose'
  },
  {
    id: 'happiness',
    question: 'Qu\'est-ce qui t\'apporte le plus de joie et de satisfaction ?',
    placeholder: 'Tes moments de bonheur...',
    category: 'fulfillment'
  }
];

const Onboarding = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAutoCompleting, setIsAutoCompleting] = useState(false);
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<Blob | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [isMicAccessError, setIsMicAccessError] = useState(false);

  // États pour l'analyse Pica
  const [picaAnalysisStage, setPicaAnalysisStage] = useState<'idle' | 'uploading' | 'scanning' | 'analyzing' | 'complete'>('idle');

  // États pour l'enregistrement vocal
  const [voiceRecordingStage, setVoiceRecordingStage] = useState<'idle' | 'recording' | 'processing' | 'complete'>('idle');
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [voiceCloneResult, setVoiceCloneResult] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    profilePhoto: null as File | null,
    audioSample: null as Blob | null,
    questionnaire: {} as Record<string, string>,
    picaAnalysis: null as any,
    personalityProfile: null as any
  });

  const { setUser } = useApp();
  const navigate = useNavigate();

  const totalSteps = 6;

  // Vérifier la prise en charge de MediaRecorder
  const isMediaRecorderSupported = useCallback(() => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }, []);

  // Nettoyage des ressources
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    };
  }, [isRecording]);

  // Photo Upload avec analyse Pica AI
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFormData(prev => ({ ...prev, profilePhoto: file }));
    setPicaAnalysisStage('uploading');

    toast.loading('📸 Upload et analyse Pica AI...', { id: 'pica-analysis' });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPicaAnalysisStage('scanning');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPicaAnalysisStage('analyzing');

      const analysis = await PicaService.analyzeFace(file);
      setFormData(prev => ({ ...prev, picaAnalysis: analysis }));
      setPicaAnalysisStage('complete');
      setAnalysisComplete(true);

      toast.success('✨ Analyse Pica AI terminée !', { id: 'pica-analysis' });
    } catch (error) {
      console.error('Erreur analyse Pica:', error);
      Sentry.captureException(error);
      toast.error('🔴 Erreur analyse Pica, mode simulation activé', { id: 'pica-analysis' });

      const fallbackAnalysis = {
        faceDetected: true,
        emotionalState: 'confident',
        ageEstimate: 28 + Math.floor(Math.random() * 10),
        personalityTraits: ['creative', 'determined', 'empathetic', 'analytical'],
        biometricScore: 0.92,
        confidence: 0.88
      };

      setFormData(prev => ({ ...prev, picaAnalysis: fallbackAnalysis }));
      setPicaAnalysisStage('complete');
      setAnalysisComplete(true);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024
  });

  // Enregistrement vocal pour clonage
  const startVoiceRecording = useCallback(async (isForInput = false) => {
    if (!isMediaRecorderSupported()) {
      console.error('MediaRecorder non supporté dans ce navigateur');
      Sentry.captureMessage('MediaRecorder non supporté');
      toast.error('🔴 Votre navigateur ne supporte pas l\'enregistrement vocal. Essayez un autre navigateur ou passez cette étape.');
      setIsMicAccessError(true);
      setVoiceRecordingStage('idle');
      return;
    }

    try {
      setVoiceRecordingStage('recording');
      setIsMicAccessError(false);
      setIsRecording(true);
      setRecordingTime(0);
      toast.loading('🎙️ Initialisation du microphone...', { id: 'mic-init' });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          console.debug('Données audio reçues:', event.data.size, 'octets');
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: mimeType });
        stream.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current = null;
        setIsRecording(false);
        setRecordingTime(0);

        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }

        if (isForInput) {
          setVoiceRecordingStage('processing');
          toast.loading('🎤 Transcription en cours...', { id: 'voice-input' });

          try {
            const transcribedText = await ElevenLabsService.transcribeAudio(audioBlob);
            const questionId = psychologyQuestions[currentQuestionIndex].id;
            setFormData(prev => ({
              ...prev,
              questionnaire: { ...prev.questionnaire, [questionId]: transcribedText }
            }));
            setVoiceRecordingStage('complete');
            toast.success('✅ Réponse vocalisée transcrite !', { id: 'voice-input' });
          } catch (error) {
            console.error('Erreur transcription:', error);
            Sentry.captureException(error);
            toast.error('🔴 Erreur transcription, veuillez réessayer', { id: 'voice-input' });
            setVoiceRecordingStage('idle');
          }
        } else {
          setRecordedAudioBlob(audioBlob);
          setVoiceRecordingStage('processing');
          toast.loading('🎤 Clonage vocal ElevenLabs...', { id: 'voice-clone' });

          try {
            const cloneResult = await ElevenLabsService.cloneVoice(audioBlob, formData.name || 'User');
            setVoiceCloneResult(cloneResult);
            setFormData(prev => ({ ...prev, audioSample: audioBlob }));
            setVoiceRecordingStage('complete');
            toast.success('✨ Voix clonée avec succès !', { id: 'voice-clone' });
            generateVoicePreview(cloneResult.voiceId);
          } catch (error) {
            console.error('Erreur clonage:', error);
            Sentry.captureException(error);
            toast.error('🔴 Erreur clonage, mode simulation activé', { id: 'voice-clone' });
            setVoiceCloneResult({
              voiceId: `demo-voice-${Date.now()}`,
              name: `${formData.name}_demo_voice`,
              status: 'ready'
            });
            setFormData(prev => ({ ...prev, audioSample: audioBlob }));
            setVoiceRecordingStage('complete');
            generateVoicePreview(false);
          }
        }
      };

      recorder.onerror = (event: Event) => {
        console.error('Erreur MediaRecorder:', (event as any).error);
        Sentry.captureException((event as any).error);
        toast.error('🔴 Erreur lors de l\'enregistrement. Vérifiez les permissions ou réessayez.');
        setIsRecording(false);
        setVoiceRecordingStage('idle');
        setIsMicAccessError(true);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100);
      console.debug('Enregistrement démarré avec MIME type:', mimeType);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= 10) {
            stopVoiceRecording();
            return 10;
          }
          return newTime;
        });
      }, 1000);

      // Arrêt automatique après 10 secondes
      setTimeout(() => {
        if (isRecording) {
          stopVoiceRecording();
        }
      }, 10000);

      toast.dismiss('mic-init');
    } catch (error) {
      console.error('Erreur accès microphone:', error);
      Sentry.captureException(error);
      toast.error('🔴 Impossible d\'accéder au microphone. Vérifiez les permissions ou passez cette étape.', { id: 'mic-init' });
      setIsMicAccessError(true);
      setVoiceRecordingStage('idle');
      setIsRecording(false);
    }
  }, [formData.name, currentQuestionIndex, isMediaRecorderSupported, isRecording]);

  const stopVoiceRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  }, [isRecording]);

  const skipVoiceRecording = useCallback(() => {
    setVoiceRecordingStage('complete');
    setFormData(prev => ({ ...prev, audioSample: null }));
    setVoiceCloneResult({
      voiceId: `demo-voice-${Date.now()}`,
      name: `${formData.name || 'User'}_demo_voice`,
      status: 'ready'
    });
    toast.success('✅ Étape de clonage vocal sautée. Utilisation de la voix par défaut.');
    generateVoicePreview(false);
  }, [formData.name]);

  const resetVoiceRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setRecordedAudioBlob(null);
    setVoiceCloneResult(null);
    setRecordingTime(0);
    setIsRecording(false);
    setVoiceRecordingStage('idle');
    setPreviewAudio(null);
    setIsMicAccessError(false);
    setFormData(prev => ({ ...prev, audioSample: null }));
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  }, [isRecording]);

  const generateVoicePreview = async (voiceId: string | boolean) => {
    setIsGeneratingPreview(true);
    const text = formData.name ? `Bonjour ${formData.name}, bienvenue dans Quantum Self AI !` : 'Bonjour, bienvenue dans Quantum Self AI !';
    try {
      const voice = typeof voiceId === 'string' && !voiceId.startsWith('demo-') ? voiceId : 'bIHbv24MWmeRgasZH58o';
      const audio = await ElevenLabsService.generateSpeech(text, voice);
      setPreviewAudio(audio);
      toast.success(`✅ Aperçu vocal généré avec ${typeof voiceId === 'string' && !voiceId.startsWith('demo-') ? 'votre voix clonée' : 'voix par défaut'}`);
    } catch (error) {
      console.error('Erreur aperçu vocal:', error);
      Sentry.captureException(error);
      toast.error('🔴 Erreur génération aperçu vocal');
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const autoCompleteQuestionnaire = useCallback(() => {
    setIsAutoCompleting(true);
    const userName = formData.name || 'Explorer';

    const autoAnswers = {
      dreams: `En tant que ${userName}, mon plus grand rêve est de réaliser mon potentiel et d'avoir un impact positif sur le monde.`,
      fears: `Ma plus grande préoccupation est de ne pas saisir les opportunités qui se présentent.`,
      values: `Authenticité, croissance personnelle, connexions humaines significatives.`,
      regrets: `Je regrette parfois de ne pas avoir pris plus de risques, mais j'apprends de chaque expérience.`,
      motivation: `Ce qui me motive chaque matin est la possibilité de grandir et de contribuer.`,
      success: `Le succès, c'est l'équilibre entre accomplissement personnel et impact positif.`,
      relationships: `Je veux cultiver des relations authentiques basées sur la confiance et la croissance.`,
      growth: `J'aimerais progresser dans ma capacité à prendre des décisions alignées avec mes valeurs.`,
      legacy: `Je veux être rappelé(e) comme quelqu'un qui inspire les autres à croire en leur potentiel.`,
      happiness: `Ce qui m'apporte le plus de joie, ce sont les connexions authentiques et les victoires quotidiennes.`
    };

    let completedCount = 0;
    const interval = setInterval(() => {
      const questionIds = Object.keys(autoAnswers);
      if (completedCount < questionIds.length) {
        const questionId = questionIds[completedCount];
        setFormData(prev => ({
          ...prev,
          questionnaire: {
            ...prev.questionnaire,
            [questionId]: autoAnswers[questionId as keyof typeof autoAnswers]
          }
        }));
        completedCount++;
      } else {
        clearInterval(interval);
        setIsAutoCompleting(false);
        toast.success('✨ Questionnaire auto-complété !');
      }
    }, 300);
  }, [formData.name]);

  const skipQuestionnaire = useCallback(() => {
    const userName = formData.name || 'Explorer';
    const minimalAnswers = {
      dreams: `Réaliser mon potentiel en tant que ${userName}`,
      motivation: 'Croissance personnelle et impact positif',
      values: 'Authenticité, apprentissage, connexion',
      success: 'Équilibre et épanouissement personnel',
      happiness: 'Moments de connexion et accomplissements'
    };

    setFormData(prev => ({ ...prev, questionnaire: minimalAnswers }));
    toast.success('✅ Questionnaire sauté avec réponses minimales');
  }, [formData.name]);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // const newUser = {
      //   id: Date.now().toString(),
      //   name: formData.name,
      //   onboardingComplete: true,
      //   selectedVersions: quantumVersions.filter(v => selectedVersions.includes(v.id)),
      //   questionnaire: formData.questionnaire,
      //   picaAnalysis: formData.picaAnalysis,
      //   personalityProfile: formData.personalityProfile,
      //   profilePhoto: formData.profilePhoto ? URL.createObjectURL(formData.profilePhoto) : undefined,
      //   voiceCloneId: voiceCloneResult?.voiceId
      // };
 //     setUser(newUser);
      toast.success('🚀 Bienvenue dans Quantum Self AI !');
      navigate('/dashboard');
    }
  }, [currentStep, formData, selectedVersions, voiceCloneResult, navigate]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setIsVoiceInput(false);
    }
  }, [currentStep]);

  const handleQuestionnaireAnswer = useCallback((questionId: string, answer: string) => {
    setFormData(prev => ({
      ...prev,
      questionnaire: { ...prev.questionnaire, [questionId]: answer }
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < psychologyQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsVoiceInput(false);
    }
  }, [currentQuestionIndex]);

  const prevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setIsVoiceInput(false);
    }
  }, [currentQuestionIndex]);

  const toggleVersionSelection = useCallback((versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      } else if (prev.length < 5) {
        return [...prev, versionId];
      }
      return prev;
    });
  }, []);

  const generatePersonalities = useCallback(() => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        personalityProfile: {
          coreTraits: ['analytical', 'creative', 'empathetic'],
          communicationStyle: 'thoughtful and encouraging',
          decisionMaking: 'balanced between logic and intuition',
          stressResponse: 'seeks solutions and support',
          motivationDrivers: ['growth', 'connection', 'impact']
        }
      }));
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast.success('✨ Profil de personnalité généré !');
    }, 4000);
  }, []);

  const generateVersionPreview = useCallback(async (versionId: string) => {
    const version = quantumVersions.find(v => v.id === versionId);
    if (!version) return;

    setIsGeneratingPreview(true);
    const text = `Salut ${formData.name || 'Explorer'}, je suis ${version.name} ! Prêt à explorer ton potentiel quantique avec moi ?`;
    try {
      const voiceId = voiceCloneResult?.voiceId && !voiceCloneResult.voiceId.startsWith('demo-')
        ? voiceCloneResult.voiceId
        : 'bIHbv24MWmeRgasZH58o';
      const audio = await ElevenLabsService.generateSpeech(text, voiceId);
      setPreviewAudio(audio);
      toast.success(`✅ Aperçu généré pour ${version.name}`);
    } catch (error) {
      console.error('Erreur aperçu version:', error);
      Sentry.captureException(error);
      toast.error('🔴 Erreur génération aperçu version');
    } finally {
      setIsGeneratingPreview(false);
    }
  }, [formData.name, voiceCloneResult]);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1: return formData.name.trim().length > 0;
      case 2: return formData.profilePhoto !== null && picaAnalysisStage === 'complete';
      case 3: return voiceRecordingStage === 'complete';
      case 4: return Object.keys(formData.questionnaire).length >= 3;
      case 5: return selectedVersions.length >= 3 && analysisComplete;
      case 6: return true;
      default: return false;
    }
  }, [currentStep, formData, picaAnalysisStage, voiceRecordingStage, selectedVersions, analysisComplete]);

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
            role="form"
            aria-labelledby="step1-title"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white" aria-hidden="true" />
            </div>
            <h2 id="step1-title" className="text-3xl font-bold text-white mb-4">
              Bienvenue dans l'ère quantique !
            </h2>
            <p className="text-slate-200 mb-8">
              Commençons par faire connaissance. Comment veux-tu qu'on t'appelle ?
            </p>
            <input
              type="text"
              placeholder="Ton prénom..."
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-4 rounded-xl bg-gray-800/50 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg backdrop-blur-sm"
              aria-label="Votre prénom"
              required
            />
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
            role="form"
            aria-labelledby="step2-title"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10 text-white" aria-hidden="true" />
            </div>
            <h2 id="step2-title" className="text-3xl font-bold text-white mb-4">
              Analyse biométrique PicaAI
            </h2>
            <p className="text-slate-200 mb-8">
              Upload une photo pour une analyse avancée et la création de tes avatars Tavus.
            </p>
            {picaAnalysisStage === 'idle' && (
              <div
                {...getRootProps()}
                className={`border-3 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:border-blue-500 bg-gray-800/30'}`}
                role="button"
                aria-label="Zone de dépôt pour photo"
              >
                <input {...getInputProps()} aria-hidden="true" />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
                <p className="text-slate-200">
                  {isDragActive ? 'Dépose ta photo ici' : 'Clique ou glisse une photo'}
                </p>
                <div className="text-xs text-gray-400 mt-2">
                  Formats: JPG, PNG, WebP (max 10MB)
                </div>
              </div>
            )}
            {formData.profilePhoto && picaAnalysisStage !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <img
                  src={URL.createObjectURL(formData.profilePhoto)}
                  alt="Photo en cours d'analyse"
                  className="w-full h-64 object-cover rounded-xl"
                  aria-label="Photo uploadée"
                />
                {picaAnalysisStage === 'uploading' && (
                  <div className="absolute inset-0 bg-blue-500/30 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-white font-semibold">Upload en cours...</p>
                    </div>
                  </div>
                )}
                {picaAnalysisStage === 'scanning' && (
                  <div className="absolute inset-0 bg-blue-600/20 rounded-xl">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"
                      animate={{
                        x: [-100, 100, -100],
                        opacity: [0.2, 0.8, 0.2]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/70 backdrop-blur-sm rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2 text-blue-400">
                        <Scan className="w-4 h-4" aria-hidden="true" />
                        <span className="text-sm font-semibold">Scan biométrique...</span>
                      </div>
                    </div>
                  </div>
                )}
                {picaAnalysisStage === 'analyzing' && (
                  <div className="absolute inset-0 bg-purple-600/20 rounded-xl">
                    <svg className="w-full h-full" viewBox="0 0 100 100" aria-hidden="true">
                      {[...Array(10)].map((_, i) => (
                        <motion.line
                          key={`h-${i}`}
                          x1="0"
                          y1={i * 10}
                          x2="100"
                          y2={i * 10}
                          stroke="purple"
                          strokeWidth="0.2"
                          opacity="0.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                        />
                      ))}
                    </svg>
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-400 rounded-full"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                      />
                    ))}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/70 backdrop-blur-sm rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2 text-purple-400">
                        <Eye className="w-4 h-4" aria-hidden="true" />
                        <span className="text-sm font-semibold">Analyse IA avancée...</span>
                      </div>
                    </div>
                  </div>
                )}
                {picaAnalysisStage === 'complete' && formData.picaAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-green-500/20 border border-green-500/30 rounded-lg p-4"
                    role="region"
                    aria-labelledby="pica-analysis-result"
                  >
                    <h4 id="pica-analysis-result" className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                      <Check className="w-4 h-4" aria-hidden="true" />
                      Analyse Pica AI terminée !
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white/10 rounded-lg p-2">
                        <div className="text-gray-400">État émotionnel</div>
                        <div className="text-white font-semibold capitalize">{formData.picaAnalysis.emotionalState}</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2">
                        <div className="text-gray-400">Âge estimé</div>
                        <div className="text-white font-semibold">{formData.picaAnalysis.ageEstimate} ans</div>
                      </div>
                      <div className="col-span-2 bg-white/10 rounded-lg p-2">
                        <div className="text-gray-400 text-xs mb-1">Traits détectés :</div>
                        <div className="flex flex-wrap gap-1">
                          {formData.picaAnalysis.personalityTraits.map((trait: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs capitalize">
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="text-blue-400 text-xs font-semibold">🤖 Powered by Pica AI</div>
                      <div className="text-gray-200 text-xs">Score: {(formData.picaAnalysis.confidence * 100).toFixed(1)}%</div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
            role="form"
            aria-labelledby="step3-title"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mic className="w-10 h-10 text-white" aria-hidden="true" />
            </div>
            <h2 id="step3-title" className="text-3xl font-bold text-white mb-4">
              Clonage vocal ElevenLabs
            </h2>
            <p className="text-slate-200 mb-6">
              Enregistre 10 secondes de ta voix pour des réponses ultra-personnalisées (optionnel).
            </p>
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-8">
              {voiceRecordingStage === 'idle' && (
                <>
                  {isMicAccessError && (
                    <div className="mb-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                      <p className="text-red-400 text-sm">
                        🔴 Problème d'accès au microphone. Vérifiez les permissions ou passez cette étape.
                      </p>
                    </div>
                  )}
                  <div className="flex gap-3 justify-center mb-4">
                    <motion.button
                      onClick={() => startVoiceRecording(false)}
                      disabled={isRecording}
                      className="w-20 h-20 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center shadow-lg transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Commencer l'enregistrement vocal"
                      role="button"
                    >
                      <Mic className="w-10 h-10 text-white" aria-hidden="true" />
                    </motion.button>
                    <motion.button
                      onClick={skipVoiceRecording}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      aria-label="Sauter l'enregistrement vocal"
                    >
                      <SkipForward className="w-4 h-4" aria-hidden="true" />
                      Sauter
                    </motion.button>
                  </div>
                  <p className="text-slate-200 mb-4">Appuie pour commencer l'enregistrement ou saute cette étape</p>
                  <div className="text-xs text-gray-500">
                    🎙️ Clonage vocal via ElevenLabs officiel
                  </div>
                </>
              )}
              {voiceRecordingStage === 'recording' && (
                <>
                  <motion.button
                    onClick={stopVoiceRecording}
                    className="w-20 h-20 rounded-full bg-red-600 animate-pulse flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Arrêter l'enregistrement"
                    role="button"
                  >
                    <MicOff className="w-10 h-10 text-white" aria-hidden="true" />
                  </motion.button>
                  <div className="space-y-4">
                    <p className="text-white font-semibold text-lg">
                      Enregistrement... {formatTime(recordingTime)} / 0:10
                    </p>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(recordingTime / 10) * 100}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-4">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-green-400 rounded-full"
                          animate={{ height: [4, Math.random() * 30 + 10, 4] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                    <p className="text-gray-400 text-sm">Parle clairement pour un clonage optimal</p>
                  </div>
                </>
              )}
              {voiceRecordingStage === 'processing' && (
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Mic className="w-8 h-8 text-white" aria-hidden="true" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white mb-2">Clonage en cours...</h3>
                  <p className="text-yellow-400 text-sm">Traitement via ElevenLabs</p>
                </div>
              )}
              {voiceRecordingStage === 'complete' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-4">Enregistrement terminé !</h3>
                  {recordedAudioBlob && <AudioPlayer audioBlob={recordedAudioBlob} className="mb-4" />}
                  {previewAudio && (
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
                      <p className="text-blue-400 font-semibold mb-2">Aperçu vocal :</p>
                      <AudioPlayer audioBlob={previewAudio} className="mb-2" />
                      <p className="text-xs text-gray-300">
                        {voiceCloneResult?.voiceId && !voiceCloneResult.voiceId.startsWith('demo-') ? 'Votre voix clonée' : 'Voix par défaut (Will)'}
                      </p>
                    </div>
                  )}
                  <div className="text-sm text-slate-200 space-y-2">
                    <p>Durée: {formatTime(recordingTime)}</p>
                    {voiceCloneResult && (
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                        <p className="text-green-400 font-semibold">✅ Voix clonée avec succès !</p>
                        <p className="text-xs text-gray-300">ID: {voiceCloneResult.voiceId.substring(0, 12)}...</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={resetVoiceRecording}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all mx-auto"
                    aria-label="Recommencer l'enregistrement"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    Recommencer
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        );

      case 4:
        const currentQuestion = psychologyQuestions[currentQuestionIndex];
        const answeredQuestions = Object.keys(formData.questionnaire).length;
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
            role="form"
            aria-labelledby="step4-title"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-white" aria-hidden="true" />
              </div>
              <h2 id="step4-title" className="text-3xl font-bold text-white mb-4">
                Profil psychologique
              </h2>
              <p className="text-slate-200 mb-4">
                Question {currentQuestionIndex + 1} sur {psychologyQuestions.length} • {answeredQuestions} réponses
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestionIndex + 1) / psychologyQuestions.length) * 100}%` }}
                />
              </div>
              <div className="flex gap-3 justify-center mb-6">
                <motion.button
                  onClick={skipQuestionnaire}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Sauter le questionnaire"
                >
                  <SkipForward className="w-4 h-4" aria-hidden="true" />
                  Sauter
                </motion.button>
                <motion.button
                  onClick={autoCompleteQuestionnaire}
                  disabled={isAutoCompleting}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Auto-compléter le questionnaire"
                >
                  {isAutoCompleting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Wand2 className="w-4 h-4" aria-hidden="true" />
                      </motion.div>
                      Auto-complétion...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" aria-hidden="true" />
                      Auto-compléter
                    </>
                  )}
                </motion.button>
                <motion.button
                  onClick={() => setIsVoiceInput(!isVoiceInput)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${isVoiceInput ? 'bg-green-500 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={isVoiceInput ? 'Désactiver saisie vocale' : 'Activer saisie vocale'}
                >
                  {isVoiceInput ? (
                    <>
                      <MicOff className="w-4 h-4" aria-hidden="true" />
                      Texte
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" aria-hidden="true" />
                      Voix
                    </>
                  )}
                </motion.button>
              </div>
              {isAutoCompleting && (
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 mb-6">
                  <p className="text-blue-400 text-sm">✨ Génération automatique des réponses...</p>
                </div>
              )}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800/50 backdrop-blur rounded-xl p-8"
              >
                <h3 className="text-xl font-semibold text-white mb-6">{currentQuestion.question}</h3>
                {isVoiceInput ? (
                  <div className="space-y-4">
                    {isMicAccessError && (
                      <div className="mb-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                        <p className="text-red-400 text-sm">
                          🔴 Problème d'accès au microphone. Vérifiez les permissions ou passez en saisie texte.
                        </p>
                      </div>
                    )}
                    {isRecording ? (
                      <>
                        <motion.button
                          onClick={stopVoiceRecording}
                          className="w-16 h-16 rounded-full bg-red-600 animate-pulse flex items-center justify-center mx-auto mb-4 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Arrêter l'enregistrement"
                        >
                          <MicOff className="w-8 h-8 text-white" aria-hidden="true" />
                        </motion.button>
                        <p className="text-white font-semibold">
                          Enregistrement... {formatTime(recordingTime)} / 0:10
                        </p>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <motion.div
                            className="h-full bg-green-500 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(recordingTime / 10) * 100}%` }}
                            transition={{ duration: 0.1 }}
                          />
                        </div>
                        <div className="flex items-center justify-center gap-1 mt-4">
                          {[...Array(15)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-green-400 rounded-full"
                              animate={{ height: [4, Math.random() * 20 + 10, 4] }}
                              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.08 }}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <motion.button
                        onClick={() => startVoiceRecording(true)}
                        disabled={isRecording}
                        className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Commencer l'enregistrement vocal"
                      >
                        <Mic className="w-8 h-8 text-white" aria-hidden="true" />
                      </motion.button>
                    )}
                    <p className="text-gray-400 text-sm">
                      {isRecording ? 'Parle clairement...' : 'Appuie pour répondre par voix'}
                    </p>
                  </div>
                ) : (
                  <textarea
                    value={formData.questionnaire[currentQuestion.id] || ''}
                    onChange={(e) => handleQuestionnaireAnswer(currentQuestion.id, e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    className="w-full p-4 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-500 focus:outline-none min-h-[120px] resize-none"
                    rows={4}
                    aria-label={currentQuestion.question}
                  />
                )}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={prevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-all"
                    aria-label="Question précédente"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    Précédente
                  </button>
                  <button
                    onClick={nextQuestion}
                    disabled={currentQuestionIndex === psychologyQuestions.length - 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-600 transition-all"
                    aria-label="Question suivante"
                  >
                    Suivante
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
            {answeredQuestions > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 text-sm">
                    ✅ {answeredQuestions} question{answeredQuestions > 1 ? 's' : ''} répondue{answeredQuestions > 1 ? 's' : ''} • {answeredQuestions >= 3 ? 'Suffisant pour continuer !' : '3 réponses minimum'}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
            role="region"
            aria-labelledby="step5-title"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" aria-hidden="true" />
              </div>
              <h2 id="step5-title" className="text-3xl font-bold text-white mb-4">
                Versions quantiques
              </h2>
              <p className="text-slate-200 mb-6">
                Sélectionne 3 à 5 versions pour commencer ton aventure.
              </p>
              {!analysisComplete && (
                <motion.button
                  onClick={generatePersonalities}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Générer les personnalités"
                >
                  {isAnalyzing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Brain className="w-5 h-5" aria-hidden="true" />
                      </motion.div>
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" aria-hidden="true" />
                      Générer les personnalités
                    </>
                  )}
                </motion.button>
              )}
            </div>
            {analysisComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {quantumVersions.map((version) => (
                  <motion.div
                    key={version.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * quantumVersions.indexOf(version) }}
                  >
                    <VersionCard
                      version={version}
                      onSelect={() => toggleVersionSelection(version.id)}
                      selected={selectedVersions.includes(version.id)}
                    />
                    {selectedVersions.includes(version.id) && (
                      <motion.button
                        onClick={() => generateVersionPreview(version.id)}
                        disabled={isGeneratingPreview}
                        className="mt-2 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg w-full justify-center hover:bg-green-700 transition-all disabled:bg-gray-500"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        aria-label={`Écouter aperçu de ${version.name}`}
                      >
                        <Play className="w-4 h-4" aria-hidden="true" />
                        Aperçu vocal
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
            {previewAudio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-4 right-4 bg-gray-800 rounded-lg p-4 shadow-lg"
              >
                <AudioPlayer audioBlob={previewAudio} className="w-64" />
              </motion.div>
            )}
            {selectedVersions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-center"
              >
                <p className="text-slate-200 mb-4">
                  {selectedVersions.length} version{selectedVersions.length > 1 ? 's' : ''} sélectionnée{selectedVersions.length > 1 ? 's' : ''}
                </p>
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-green-400 text-sm">✨ {selectedVersions.length >= 3 ? 'Prêt à continuer !' : 'Sélectionne au moins 3 versions'}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
            role="region"
            aria-labelledby="step6-title"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" aria-hidden="true" />
              </div>
              <h2 id="step6-title" className="text-3xl font-bold text-white mb-4">
                Résumé de ton profil
              </h2>
              <p className="text-slate-200 mb-6">
                Voici un aperçu de tes données avant de plonger dans l'univers quantique.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-8 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Identité</h3>
                <p className="text-slate-200">Nom : {formData.name || 'Non spécifié'}</p>
                {formData.profilePhoto && (
                  <img
                    src={URL.createObjectURL(formData.profilePhoto)}
                    alt="Photo de profil"
                    className="w-24 h-24 rounded-full mt-2"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Analyse Pica AI</h3>
                {formData.picaAnalysis && (
                  <div className="text-slate-200 text-sm">
                    <p>État émotionnel : {formData.picaAnalysis.emotionalState}</p>
                    <p>Âge estimé : {formData.picaAnalysis.ageEstimate} ans</p>
                    <p>Traits : {formData.picaAnalysis.personalityTraits.join(', ')}</p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Voix clonée</h3>
                {voiceCloneResult ? (
                  <div className="text-slate-200 text-sm">
                    <p>Statut : {voiceCloneResult.status}</p>
                    <p>ID : {voiceCloneResult.voiceId.substring(0, 12)}...</p>
                  </div>
                ) : (
                  <p className="text-slate-200 text-sm">Voix par défaut utilisée (aucun enregistrement)</p>
                )}
                {previewAudio && <AudioPlayer audioBlob={previewAudio} className="mt-2" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Questionnaire</h3>
                <div className="text-slate-200 text-sm space-y-2">
                  {Object.entries(formData.questionnaire).map(([id, answer]) => (
                    <p key={id}>
                      <strong>{psychologyQuestions.find(q => q.id === id)?.question} :</strong> {answer}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Versions sélectionnées</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVersions.map(id => (
                    <span key={id} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                      {quantumVersions.find(v => v.id === id)?.name}
                    </span>
                  ))}
                </div>
              </div>
              <motion.button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all mx-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Modifier les réponses"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Modifier
              </motion.button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, ease: 'linear' }}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="relative z-10 w-full bg-gray-800/50 h-2">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="relative z-10 p-6 flex items-center justify-between">
        <div className="text-white">
          <span className="text-sm text-gray-400">Étape {currentStep} sur {totalSteps}</span>
          {currentStep === 4 && (
            <div className="text-xs text-green-400 mt-1">
              ⚡ Sauter ou répondre par voix disponible
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Brain className="w-4 h-4" aria-hidden="true" />
          <span>Quantum Self AI</span>
        </div>
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="relative z-10 p-6 flex items-center justify-between">
        <motion.button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-800/50 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-all backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Étape précédente"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          Précédent
        </motion.button>
        <motion.button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={currentStep === totalSteps ? 'Finaliser' : 'Étape suivante'}
        >
          {currentStep === totalSteps ? (
            <>
              <Check className="w-4 h-4" aria-hidden="true" />
              Entrer dans l'univers quantique
            </>
          ) : (
            <>
              Suivant
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

// Wrap Sentry initialization to avoid frameElement access
if (typeof window !== 'undefined') {
  try {
    Sentry.init({
      dsn: 'https://ab14fcb00b82045a465dfc7c9c3b2d49@o4509454922088448.ingest.de.sentry.io/4509527930044496',
      environment: process.env.NODE_ENV,
      integrations: [
        new Sentry.BrowserTracing({
          tracePropagationTargets: ['localhost', 'bolt.new'],
        }),
      ],
      tracesSampleRate: 1.0,
    });
  } catch (error) {
    console.warn('Sentry initialization failed:', error);
  }
}

export default Onboarding;