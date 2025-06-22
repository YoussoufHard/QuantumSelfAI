import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Share, Save, ArrowLeft, Volume2, VolumeX, Bot, Brain, Video, VideoOff, TestTube, Mic, MicOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { ElevenLabsService } from '../services/elevenlabs';
import { GeminiService } from '../services/gemini';
import Navigation from '../components/Navigation';
import VersionCard from '../components/VersionCard';
import AudioPlayer from '../components/AudioPlayer';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import TavusVideoChat from '../components/TavusVideoChat';
import toast from 'react-hot-toast';
import * as Sentry from '@sentry/react';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
  const { t } = useTranslation();
  const { currentVersion, setCurrentVersion, addMessage, user } = useApp();
  const [message, setMessage] = useState('');
  type MessageType = {
    id: string;
    content: string;
    sender: 'user' | 'quantum';
    timestamp: Date;
    versionId: string;
    audioBlob: Blob | null;
  };

  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      content: t('nav.features') === 'Features'
        ? 'Hi! I\'m excited to reconnect with you in Quantum Self AI. What\'s on your mind right now?'
        : 'Salut ! Je suis ravi de te retrouver dans Quantum Self AI. Qu\'est-ce qui te préoccupe en ce moment ?',
      sender: 'quantum',
      timestamp: new Date(),
      versionId: 'young-self',
      audioBlob: null,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoMode, setVideoMode] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentAudio, setCurrentAudio] = useState<Blob | null>(null);
  const [geminiConnected, setGeminiConnected] = useState<boolean | null>(null);
  const [isMicAccessError, setIsMicAccessError] = useState(false);
  const [isPlayingResponse, setIsPlayingResponse] = useState(false);
  const [isLowVolume, setIsLowVolume] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const defaultVersions = [
    {
      id: 'young-self',
      name: t('versions.youngSelf'),
      age: 16,
      type: 'past' as const,
      description: t('versions.youngDescription'),
      color: 'blue',
      icon: 'star',
      personality: ['optimistic', 'curious', 'bold'],
      systemPrompt: t('nav.features') === 'Features'
        ? 'You are the optimistic and bold 16-year-old version in Quantum Self AI. You speak with enthusiasm and encourage taking risks. You are full of energy and dreams.'
        : 'Tu es la version de 16 ans optimiste et audacieuse dans Quantum Self AI. Tu parles avec enthousiasme et encourages à prendre des risques. Tu es plein d\'énergie et de rêves.',
      traits: ['optimistic', 'curious', 'bold'],
      communicationStyle: t('nav.features') === 'Features' ? 'Enthusiastic and encouraging' : 'Enthousiaste et encourageant',
    },
    {
      id: 'wise-self',
      name: t('versions.wiseSelf'),
      age: 60,
      type: 'future' as const,
      description: t('versions.wiseDescription'),
      color: 'amber',
      icon: 'crown',
      personality: ['wise', 'patient', 'benevolent'],
      systemPrompt: t('nav.features') === 'Features'
        ? 'You are the wise 60-year-old version in Quantum Self AI. You speak with wisdom and benevolence. You have a lot of experience and perspective on life.'
        : 'Tu es la version sage de 60 ans dans Quantum Self AI. Tu parles avec sagesse et bienveillance. Tu as beaucoup d\'expérience et de recul sur la vie.',
      traits: ['wise', 'patient', 'benevolent'],
      communicationStyle: t('nav.features') === 'Features' ? 'Wise and benevolent' : 'Sage et bienveillant',
    },
    {
      id: 'success-self',
      name: t('versions.successSelf'),
      age: 35,
      type: 'parallel' as const,
      description: t('versions.successDescription'),
      color: 'emerald',
      icon: 'trophy',
      personality: ['ambitious', 'determined', 'inspiring'],
      systemPrompt: t('nav.features') === 'Features'
        ? 'You are the parallel version who achieved all professional dreams in Quantum Self AI. You share your success strategies with determination and inspiration.'
        : 'Tu es la version parallèle qui a réalisé tous ses rêves professionnels dans Quantum Self AI. Tu partages tes stratégies de succès avec détermination et inspiration.',
      traits: ['ambitious', 'determined', 'inspiring'],
      communicationStyle: t('nav.features') === 'Features' ? 'Motivating and strategic' : 'Motivant et stratégique',
    },
  ];

  const selectedVersion = currentVersion || defaultVersions[0];

  const suggestedQuestions = [
    t('questions.handleStress'),
    t('questions.careerAdvice'),
    t('questions.maintainMotivation'),
    t('questions.whatWouldYouDo'),
    t('questions.greatestLearning'),
    t('questions.howDoesItWork'),
    t('questions.tellMeAboutVersions'),
    t('questions.whatFeatures'),
  ];

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Cleanup mediaRecorder, recognition, and audio context on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    };
  }, [isRecording]);

  // Test Gemini connection on mount
  useEffect(() => {
    testGeminiConnection();
  }, []);

  const testGeminiConnection = async () => {
    try {
      console.debug('🧪 Testing Gemini connection...');
      const isConnected = await GeminiService.testConnection();
      setGeminiConnected(isConnected);
      console.debug('✅ Gemini test result:', isConnected);
      toast.success('✅ Gemini connection test successful');
    } catch (error) {
      console.error('❌ Gemini test failed:', error);
      Sentry.captureException(error);
      setGeminiConnected(false);
      // toast.error('🔴 Gemini connection test failed');
    }
  };

  const processMessage = async (inputMessage: string, audioBlob: Blob | null = null) => {
    if (!inputMessage.trim() && !audioBlob) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user' as const,
      timestamp: new Date(),
      versionId: selectedVersion.id,
      audioBlob,
    };

    setMessages(prev => [...prev, userMessage]);
    addMessage(userMessage);
    setMessage('');
    setIsLoading(true);

    try {
      let responseText: string;

      if (geminiConnected) {
        console.debug('🧠 Using Gemini AI with RAG...');
        try {
          responseText = await GeminiService.generateResponse(inputMessage, selectedVersion, messages);
          console.debug('✅ Gemini response generated:', responseText.substring(0, 100) + '...');
        } catch (geminiError) {
          console.warn('⚠️ Gemini error, falling back to simulated response:', geminiError);
          Sentry.captureException(geminiError);
          toast('⚠️ Gemini unavailable, using simulated response', {
            style: { background: '#fefcbf', color: '#b45309' },
          });
          responseText = ElevenLabsService.getSimulatedResponse(inputMessage, {
            name: selectedVersion.name,
            systemPrompt: selectedVersion.systemPrompt,
            communicationStyle: selectedVersion.communicationStyle.split(' ')[0] as any,
            traits: selectedVersion.personality,
            language: t('nav.features') === 'Features' ? 'en' : 'fr',
          });
        }
      } else {
        console.debug('🎭 Using simulated response (Gemini offline)...');
        toast('⚠️ Gemini offline, using simulated response', {
          style: { background: '#fefcbf', color: '#b45309' },
        });
        responseText = ElevenLabsService.getSimulatedResponse(inputMessage, {
          name: selectedVersion.name,
          systemPrompt: selectedVersion.systemPrompt,
          communicationStyle: selectedVersion.communicationStyle.split(' ')[0] as any,
          traits: selectedVersion.personality,
          language: t('nav.features') === 'Features' ? 'en' : 'fr',
        });
      }

      let responseAudio: Blob | null = null;
      if (audioEnabled || voiceMode) {
        try {
          const voiceId = user?.voiceCloneId && !user.voiceCloneId.startsWith('demo-voice')
            ? user.voiceCloneId
            : 'bIHbv24MWmeRgasZH58o';
          console.debug('🔊 Generating audio with voiceId:', voiceId);

          responseAudio = await ElevenLabsService.generateSpeech(responseText, voiceId);
          if (responseAudio.size > 0) {
            console.debug('✅ ElevenLabs audio generated successfully');
            toast.success(`🔊 Audio generated with ${voiceId === user?.voiceCloneId ? 'your cloned voice' : 'Will\'s voice'}`);
          } else {
            console.warn('⚠️ Empty audio generated');
            // toast.error('🔴 Audio generation failed, using text response');
          }
        } catch (audioError) {
          console.warn('⚠️ Audio generation error:', audioError);
          Sentry.captureException(audioError);
          // toast.error('🔴 Audio generation failed, using text response');
        }
      }

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        sender: 'quantum' as const,
        timestamp: new Date(),
        versionId: selectedVersion.id,
        audioBlob: responseAudio,
      };

      setMessages(prev => [...prev, aiMessage]);
      addMessage(aiMessage);

      if (voiceMode && responseAudio) {
        setCurrentAudio(responseAudio);
        setIsPlayingResponse(true);
      }

    } catch (error) {
      console.error('❌ Error generating response:', error);
      Sentry.captureException(error);
      // toast.error(t('errors.generationError'));

      const fallbackMessage = {
        id: (Date.now() + 1).toString(),
        content: ElevenLabsService.getSimulatedResponse(inputMessage, {
          name: selectedVersion.name,
          systemPrompt: selectedVersion.systemPrompt,
          communicationStyle: selectedVersion.communicationStyle.split(' ')[0] as any,
          traits: selectedVersion.personality,
          language: t('nav.features') === 'Features' ? 'en' : 'fr',
        }),
        sender: 'quantum' as const,
        timestamp: new Date(),
        versionId: selectedVersion.id,
        audioBlob: null,
      };

      setMessages(prev => [...prev, fallbackMessage]);
      addMessage(fallbackMessage);
    } finally {
      setIsLoading(false);
      setIsWaitingForResponse(false);
    }
  };

  const startVoiceRecording = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      console.error('❌ MediaRecorder not supported in this browser');
      Sentry.captureMessage('MediaRecorder not supported');
      toast.error('🔴 Your browser does not support voice recording. Try another browser or use text mode.');
      setIsMicAccessError(true);
      return;
    }

    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      console.error('❌ SpeechRecognition not supported in this browser');
      Sentry.captureMessage('SpeechRecognition not supported');
      toast.error('🔴 Speech recognition not supported. Please use text mode.');
      setIsMicAccessError(true);
      return;
    }

    if (isWaitingForResponse || isPlayingResponse) {
      console.debug('⏳ Waiting for response or playback to complete');
      return;
    }

    try {
      setIsMicAccessError(false);
      setIsRecording(true);
      setRecordingTime(0);
      setIsLowVolume(false);
      toast.loading('🎙️ Initializing microphone...', { id: 'mic-init' });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      // Setup volume monitoring and silence detection
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      let silenceStart = 0;
      const SILENCE_THRESHOLD = 10; // Adjust based on testing
      const SILENCE_DURATION = 2000; // 2 seconds of silence to stop
      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        if (average < SILENCE_THRESHOLD) {
          if (!silenceStart) silenceStart = Date.now();
          if (Date.now() - silenceStart > SILENCE_DURATION && isRecording) {
            console.debug('🔇 Silence detected, stopping recording');
            stopVoiceRecording();
          }
        } else {
          silenceStart = 0;
          setIsLowVolume(false);
        }
        if (average < SILENCE_THRESHOLD) {
          setIsLowVolume(true);
        }
      };
      const volumeInterval = setInterval(checkVolume, 100);

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          console.debug('📡 Audio data received:', event.data.size, 'bytes');
        }
      };

      // Start speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = t('nav.features') === 'Features' ? 'en-US' : 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognitionRef.current = recognition;

      let transcribedText = '';
      recognition.onresult = (event) => {
        transcribedText = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        console.debug('✅ Live transcription:', transcribedText);
      };

      recognition.onerror = (event) => {
        console.error('❌ Speech recognition error:', event.error);
        Sentry.captureException(new Error(`Speech recognition error: ${event.error}`));
        if (event.error === 'no-speech') {
          // Handled in onend
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          toast.error('🔴 Microphone access denied. Please allow microphone permissions.');
          setIsMicAccessError(true);
        } else {
          toast.error('🔴 Speech recognition failed. Please try again or use text mode.');
          setIsMicAccessError(true);
        }
      };

      recognition.onend = async () => {
        console.debug('🛑 Speech recognition ended');
        recognitionRef.current = null;
        clearInterval(volumeInterval);
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }

        // Process transcription after recognition ends
        if (transcribedText.trim()) {
          toast.success('✅ Voice message transcribed', { id: 'voice-message' });
          const audioBlob = new Blob(chunks, { type: mimeType });
          setIsWaitingForResponse(true);
          await processMessage(transcribedText, audioBlob);
        } else {
          console.warn('⚠️ Empty transcription received');
          toast('⚠️ No speech detected. Please speak clearly and try again.', {
            id: 'voice-message',
            style: { background: '#fefcbf', color: '#b45309' },
          });
        }
        setIsWaitingForResponse(false);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current = null;
        setIsRecording(false);
        setRecordingTime(0);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
        toast.dismiss('mic-init');
        toast.dismiss('voice-message');
      };

      recorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', (event as any).error);
        Sentry.captureException((event as any).error);
        // toast.error('🔴 Recording error. Check microphone permissions or try again.');
        setIsRecording(false);
        setIsMicAccessError(true);
        setIsWaitingForResponse(false);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          recognitionRef.current = null;
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
      };

      recognition.start();
      recorder.start(100);
      console.debug('🎙️ Recording and transcription started with MIME type:', mimeType);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      toast.dismiss('mic-init');
    } catch (error) {
      console.error('❌ Microphone access error:', error);
      Sentry.captureException(error);
      // toast.error('🔴 Unable to access microphone. Check permissions or use text mode.', { id: 'mic-init' });
      setIsMicAccessError(true);
      setIsRecording(false);
      setIsWaitingForResponse(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  }, [isRecording, isPlayingResponse, isWaitingForResponse, t, processMessage]);

  const stopVoiceRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  }, [isRecording]);

  const cancelVoiceRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsRecording(false);
      setRecordingTime(0);
      setIsMicAccessError(false);
      setIsLowVolume(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      toast('🎤 Recording cancelled');
    }
  }, [isRecording]);

  const handleSendMessage = async () => {
    await processMessage(message);
  };

  const handleVersionSelect = async (version: typeof defaultVersions[0]) => {
    setCurrentVersion(version);
    setMessages([
      {
        id: Date.now().toString(),
        content: t('nav.features') === 'Features'
          ? `Hi! It's ${version.name} in Quantum Self AI. I'm here to listen and advise you. What brings you here?`
          : `Salut ! C'est ${version.name} dans Quantum Self AI. Je suis là pour t'écouter et te conseiller. Qu'est-ce qui t'amène ?`,
        sender: 'quantum' as const,
        timestamp: new Date(),
        versionId: version.id,
        audioBlob: null,
      },
    ]);
    setCurrentAudio(null);
    setVideoMode(false);
    setVoiceMode(false);
    setIsPlayingResponse(false);
    setIsMicAccessError(false);
    setIsLowVolume(false);
  };

  // Ajout d'un état pour forcer le refresh du nom de conversation à chaque ouverture
  const [tavusConversationKey, setTavusConversationKey] = useState<number>(Date.now());

  const toggleVideoMode = () => {
    if (!videoMode) {
      toast.success('🎬 Tavus video mode activated!');
      setTavusConversationKey(Date.now() + Math.floor(Math.random() * 10000));
    } else {
      toast('💬 Back to classic chat mode');
    }
    setVideoMode(!videoMode);
    setVoiceMode(false);
    setCurrentAudio(null);
    setIsPlayingResponse(false);
  };

  const toggleVoiceMode = () => {
    if (!voiceMode) {
      toast.success('🎤 Voice conversation mode activated!');
    } else {
      toast('💬 Back to text mode');
      stopVoiceRecording();
    }
    setVoiceMode(!voiceMode);
    setVideoMode(false);
    setCurrentAudio(null);
    setIsPlayingResponse(false);
    setIsMicAccessError(false);
    setIsLowVolume(false);
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  if (!currentVersion) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Navigation />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4">
                <ArrowLeft className="w-4 h-4" />
                {t('chat.backToDashboard')}
              </Link>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{t('chat.selectVersion')}</h1>
              <p className="text-slate-600 text-lg">{t('dashboard.subtitle')}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {defaultVersions.map(version => (
                <VersionCard key={version.id} version={version} onSelect={() => handleVersionSelect(version)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (videoMode) {
    // Définir les IDs (à adapter dynamiquement si besoin)
    const replicaId = 'rf4703150052';
    const personaId = 'p48fdf065d6b';
    // Générer un nom unique à chaque ouverture
    const conversationName = `coaching-${tavusConversationKey}`;
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Navigation />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4">
                <ArrowLeft className="w-4 h-4" />
                {t('chat.backToDashboard')}
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {t('nav.features') === 'Features'
                      ? `Video Conversation with ${selectedVersion.name}`
                      : `Conversation Vidéo avec ${selectedVersion.name}`}
                  </h1>
                  <p className="text-slate-600">
                    {t('nav.features') === 'Features'
                      ? 'Speak face to face with your quantum version thanks to Tavus'
                      : 'Parlez face à face avec votre version quantique grâce à Tavus'}
                  </p>
                </div>
                <button
                  onClick={toggleVideoMode}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <VideoOff className="w-4 h-4" />
                  {t('chat.chatMode')}
                </button>
              </div>
            </div>
            <TavusVideoChat
              key={tavusConversationKey}
              replicaId={replicaId}
              personaId={personaId}
              onClose={toggleVideoMode}
              className="w-full"
              conversationName={conversationName}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navigation />
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <motion.div
                className={`w-12 h-12 bg-gradient-to-br ${
                  selectedVersion.color === 'blue'
                    ? 'from-blue-500 to-blue-700'
                    : selectedVersion.color === 'amber'
                    ? 'from-amber-500 to-amber-700'
                    : 'from-emerald-500 to-emerald-700'
                } rounded-full flex items-center justify-center ${isPlayingResponse ? 'animate-pulse' : ''}`}
                animate={isPlayingResponse ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5, repeat: isPlayingResponse ? Infinity : 0 }}
              >
                <span className="text-white font-bold text-lg">{selectedVersion.name.charAt(0)}</span>
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedVersion.name}</h2>
                <p className="text-slate-600">{selectedVersion.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={testGeminiConnection}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  geminiConnected === true
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : geminiConnected === false
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                }`}
                title={t('chat.testGemini')}
              >
                <TestTube className="w-3 h-3" />
                {geminiConnected === true
                  ? t('status.geminiConnected').split(' ')[1] + ' OK'
                  : geminiConnected === false
                  ? t('status.geminiConnected').split(' ')[1] + ' KO'
                  : t('chat.testGemini')}
              </button>
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 px-3 py-1 rounded-full border border-purple-200">
                <Bot className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">{t('status.elevenLabsActive')}</span>
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                  geminiConnected
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                    : 'bg-gradient-to-r from-red-50 to-red-50 border-red-200'
                }`}
              >
                <Brain className="w-4 h-4 text-green-600" />
                <span className={`text-xs font-medium ${geminiConnected ? 'text-green-700' : 'text-red-700'}`}>
                  Gemini {geminiConnected ? 'RAG' : 'Offline'}
                </span>
              </div>
              <button
                onClick={toggleVideoMode}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                title={t('nav.features') === 'Features' ? 'Activate Tavus video mode' : 'Activer le mode vidéo Tavus'}
              >
                <Video className="w-4 h-4" />
                <span className="text-sm font-medium">{t('status.tavusAvailable')}</span>
              </button>
              <button
                onClick={toggleVoiceMode}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  voiceMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-600 text-white hover:bg-slate-700'
                }`}
                title={
                  voiceMode
                    ? t('nav.features') === 'Features'
                      ? 'Disable voice mode'
                      : 'Désactiver le mode vocal'
                    : t('nav.features') === 'Features'
                    ? 'Enable voice mode'
                    : 'Activer le mode vocal'
                }
              >
                <Mic className="w-4 h-4" />
                <span className="text-sm font-medium">{voiceMode ? t('chat.textMode') : t('chat.voiceMode')}</span>
              </button>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  audioEnabled ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={
                  audioEnabled
                    ? t('nav.features') === 'Features'
                      ? 'Disable audio'
                      : 'Désactiver l\'audio'
                    : t('nav.features') === 'Features'
                    ? 'Enable audio'
                    : 'Activer l\'audio'
                }
              >
                {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button title="audio her" className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100">
                <Share className="w-5 h-5" />
              </button>
              <button title='second her' className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100">
                <Save className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-md p-4 rounded-2xl ${
                  msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-900 border border-slate-200'
                }`}
              >
                <p>{msg.content}</p>
                {msg.audioBlob && audioEnabled && (
                  <div className="mt-2">
                    <AudioPlayer audioBlob={msg.audioBlob} className="w-full" />
                  </div>
                )}
                <p className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 max-w-md">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <motion.div
                      className="w-2 h-2 bg-slate-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.3, repeat: Infinity }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-slate-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.3, repeat: Infinity, delay: 0.1 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-slate-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.3, repeat: Infinity, delay: 0.2 }}
                    />
                  </div>
                  <span className="text-slate-500 text-sm">
                    {t('nav.features') === 'Features' ? 'Thinking...' : 'En réflexion...'}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-slate-200 p-6">
          {voiceMode ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-blue-900">
                    {t('nav.features') === 'Features' ? 'Voice Conversation Mode' : 'Mode Conversation Vocale'}
                  </h3>
                  <button
                    onClick={toggleVoiceMode}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded-lg"
                  >
                    <MicOff className="w-4 h-4" />
                    {t('chat.textMode')}
                  </button>
                </div>
                {isMicAccessError && (
                  <div className="mb-4 bg-red-100 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">
                      🔴 Microphone access or transcription error. Check permissions or switch to text mode.
                    </p>
                    <button
                      onClick={startVoiceRecording}
                      className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Retry
                    </button>
                  </div>
                )}
                {isLowVolume && isRecording && (
                  <div className="mb-4 bg-yellow-100 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-700 text-sm">
                      ⚠️ Low microphone volume detected. Please speak louder or check your microphone.
                    </p>
                  </div>
                )}
                {isRecording ? (
                  <div className="text-center">
                    <motion.button
                      onClick={stopVoiceRecording}
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-500 animate-pulse shadow-lg:shadow-red-500/20"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Stop recording"
                    >
                      <MicOff className="w-8 h-8 text-white" />
                    </motion.button>
                    <button
                      onClick={cancelVoiceRecording}
                      className="text-sm text-red-600 hover:text-red-700 mb-4"
                      aria-label="Cancel recording"
                    >
                      Cancel
                    </button>
                    <p className="text-blue-900 font-medium mb-2">
                      {t('nav.features') === 'Features' ? 'Recording...' : 'Enregistrement...'} {formatTime(recordingTime)}
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-3 mb-4">
                      <motion.div
                        className="h-full bg-blue-500 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(recordingTime / 60) * 100}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      {[...Array(20)].map((_, index) => (
                        <motion.div
                          key={index}
                          className="w-1 bg-blue-400 rounded-full"
                          animate={{ height: [4, Math.random() * 30 + 10, 4] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: index * 0.1 }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <motion.button
                      onClick={startVoiceRecording}
                      disabled={isLoading || isPlayingResponse}
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-blue-500 hover:bg-blue-600 shadow-lg:shadow-blue-500/20 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Start recording"
                    >
                      <Mic className="w-8 h-8 text-white" />
                    </motion.button>
                    <p className="text-blue-600">
                      {t('nav.features') === 'Features' ? 'Tap to record your message' : 'Appuie pour enregistrer ton message'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4">
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={t('nav.features') === 'Features' ? 'Type your message...' : 'Tapez votre message...'}
                  className="flex-1 p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 resize-none"
                  rows={3}
                  aria-label="Message input"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !message.trim()}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-400 disabled:hover:bg-slate-400 transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(question)}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors"
                    aria-label={`Suggested question: ${question}`}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Current Audio Playback */}
        {currentAudio && (audioEnabled || voiceMode) && !videoMode && (
          <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4">
            <AudioPlayer
              audioBlob={currentAudio}
              className="w-64"
              autoPlay={true}
              onEnded={() => {
                setIsPlayingResponse(false);
                setCurrentAudio(null);
                if (voiceMode && !isMicAccessError) {
                  console.debug('🔄 Restarting recording after playback');
                  startVoiceRecording();
                }
              }}
            />
          </div>
        )}
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
    console.warn('⚠️ Sentry initialization failed:', error);
  }
}

export default Chat;