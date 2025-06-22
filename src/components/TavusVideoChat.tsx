import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Download, 
  Share2, 
  Mic, 
  MicOff,
  Video,
  VideoOff,
  RotateCcw,
  Loader
} from 'lucide-react';
import { TavusService } from '../services/tavus';
import { GeminiService } from '../services/gemini';
import { ElevenLabsService } from '../services/elevenlabs';
import toast from 'react-hot-toast';

interface TavusVideoChatProps {
  personality: any;
  userProfile: any;
  onClose: () => void;
  className?: string;
}

const TavusVideoChat: React.FC<TavusVideoChatProps> = ({
  personality,
  userProfile,
  onClose,
  className = ''
}) => {
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [avatarStatus, setAvatarStatus] = useState<'creating' | 'ready' | 'error'>('creating');
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<'idle' | 'generating' | 'ready' | 'playing'>('idle');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialiser l'avatar au montage
  useEffect(() => {
    initializeAvatar();
    setupSpeechRecognition();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const initializeAvatar = async () => {
    try {
      toast.loading('🎬 Création de votre avatar Tavus...', { id: 'avatar-creation' });
      
      // Utiliser la photo du profil utilisateur
      if (userProfile.profilePhoto) {
        const response = await fetch(userProfile.profilePhoto);
        const blob = await response.blob();
        const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
        
        const avatarId = await TavusService.createAvatar(file, `${userProfile.name}_${personality.name}`);
        setAvatarId(avatarId);
        
        // Vérifier le statut de l'avatar
        await checkAvatarStatus(avatarId);
      } else {
        throw new Error('Pas de photo de profil disponible');
      }
    } catch (error) {
      console.error('Erreur création avatar:', error);
      setAvatarStatus('error');
      toast.error('Erreur création avatar, mode simulation activé', { id: 'avatar-creation' });
      
      // Mode simulation
      setAvatarId('demo-avatar');
      setAvatarStatus('ready');
      
      // Générer le message de bienvenue
      setTimeout(() => {
        generateWelcomeVideo();
      }, 1000);
    }
  };

  const checkAvatarStatus = async (avatarId: string) => {
    try {
      const status = await TavusService.getAvatarStatus(avatarId);
      
      if (status.status === 'ready') {
        setAvatarStatus('ready');
        toast.success('✨ Avatar Tavus prêt !', { id: 'avatar-creation' });
        
        // Générer le message de bienvenue
        generateWelcomeVideo();
      } else if (status.status === 'processing') {
        // Vérifier à nouveau dans 5 secondes
        setTimeout(() => checkAvatarStatus(avatarId), 5000);
      } else {
        throw new Error('Erreur statut avatar');
      }
    } catch (error) {
      console.error('Erreur vérification statut:', error);
      setAvatarStatus('error');
    }
  };

  const generateWelcomeVideo = async () => {
    if (!avatarId) return;
    
    const welcomeScript = `Salut ! C'est ${personality.name}. Je suis ravi de pouvoir te parler en vidéo grâce à Tavus ! Qu'est-ce qui t'amène aujourd'hui ?`;
    
    await generateVideoResponse(welcomeScript);
  };

  const generateVideoResponse = async (script: string) => {
    if (!avatarId) return;
    
    try {
      setVideoStatus('generating');
      toast.loading('🎥 Génération vidéo Tavus...', { id: 'video-generation' });
      
      const videoId = await TavusService.generateVideo(avatarId, script, getBackgroundForPersonality());
      
      // Attendre que la vidéo soit prête
      await waitForVideoCompletion(videoId);
    } catch (error) {
      console.error('Erreur génération vidéo:', error);
      setVideoStatus('idle');
      toast.error('Erreur génération vidéo', { id: 'video-generation' });
    }
  };

  const waitForVideoCompletion = async (videoId: string) => {
    try {
      const checkStatus = async (): Promise<void> => {
        const status = await TavusService.getVideoStatus(videoId);
        
        if (status.status === 'completed' && status.download_url) {
          setCurrentVideo(status.download_url);
          setVideoStatus('ready');
          toast.success('🎬 Vidéo prête !', { id: 'video-generation' });
          
          // Lancer automatiquement la vidéo
          setTimeout(() => {
            playVideo();
          }, 500);
        } else if (status.status === 'processing') {
          // Vérifier à nouveau dans 3 secondes
          setTimeout(checkStatus, 3000);
        } else {
          throw new Error('Erreur génération vidéo');
        }
      };
      
      await checkStatus();
    } catch (error) {
      console.error('Erreur attente vidéo:', error);
      setVideoStatus('idle');
      
      // Mode simulation avec vidéo par défaut
      setCurrentVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
      setVideoStatus('ready');
      toast.info('🎬 Mode simulation vidéo activé', { id: 'video-generation' });
    }
  };

  const getBackgroundForPersonality = () => {
    const backgrounds = {
      'past': 'vibrant_youth',
      'present': 'modern_office',
      'future': 'serene_wisdom',
      'parallel': 'creative_space'
    };
    return backgrounds[personality.type as keyof typeof backgrounds] || 'modern_office';
  };

  const setupSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        handleVoiceMessage(transcript);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Erreur reconnaissance vocale:', event.error);
        setIsListening(false);
        toast.error('Erreur reconnaissance vocale');
      };
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Reconnaissance vocale non supportée');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.info('🎤 Écoute en cours...');
    }
  };

  const handleVoiceMessage = async (message: string) => {
    try {
      // Ajouter le message à la conversation
      const userMessage = {
        id: Date.now().toString(),
        content: message,
        sender: 'user',
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, userMessage]);
      
      // Générer la réponse avec Gemini
      const response = await GeminiService.generateResponse(message, personality, conversation);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, aiMessage]);
      
      // Générer la vidéo réponse
      await generateVideoResponse(response);
    } catch (error) {
      console.error('Erreur traitement message vocal:', error);
      toast.error('Erreur traitement du message');
    }
  };

  const handleTextMessage = async (message: string) => {
    if (!message.trim()) return;
    
    await handleVoiceMessage(message);
    setTranscript('');
  };

  const playVideo = () => {
    if (videoRef.current && currentVideo) {
      videoRef.current.play();
      setVideoStatus('playing');
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setVideoStatus('ready');
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (videoRef.current?.requestFullscreen) {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const downloadVideo = () => {
    if (currentVideo) {
      const link = document.createElement('a');
      link.href = currentVideo;
      link.download = `conversation_${personality.name}_${Date.now()}.mp4`;
      link.click();
      toast.success('📥 Téléchargement démarré');
    }
  };

  const shareVideo = async () => {
    if (currentVideo && navigator.share) {
      try {
        await navigator.share({
          title: `Conversation avec ${personality.name}`,
          text: 'Découvre ma conversation avec ma version quantique !',
          url: currentVideo
        });
      } catch (error) {
        // Fallback: copier l'URL
        navigator.clipboard.writeText(currentVideo);
        toast.success('📋 URL copiée dans le presse-papier');
      }
    } else if (currentVideo) {
      navigator.clipboard.writeText(currentVideo);
      toast.success('📋 URL copiée dans le presse-papier');
    }
  };

  const resetConversation = () => {
    setConversation([]);
    setCurrentVideo(null);
    setVideoStatus('idle');
    generateWelcomeVideo();
  };

  return (
    <div className={`bg-slate-900 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${
              personality.color === 'blue' ? 'from-blue-500 to-blue-700' :
              personality.color === 'amber' ? 'from-amber-500 to-amber-700' :
              personality.color === 'emerald' ? 'from-emerald-500 to-emerald-700' :
              personality.color === 'purple' ? 'from-purple-500 to-purple-700' :
              'from-pink-500 to-pink-700'
            } rounded-full flex items-center justify-center`}>
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">{personality.name}</h3>
              <p className="text-blue-100 text-sm">Avatar Tavus • {avatarStatus === 'ready' ? 'Prêt' : 'Création...'}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative bg-black aspect-video">
        {avatarStatus === 'creating' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-white font-medium">Création de votre avatar...</p>
              <p className="text-slate-400 text-sm">Tavus génère votre jumeau numérique</p>
            </div>
          </div>
        )}

        {avatarStatus === 'ready' && (
          <>
            {currentVideo ? (
              <video
                ref={videoRef}
                src={currentVideo}
                className="w-full h-full object-cover"
                controls={false}
                muted={isMuted}
                onEnded={() => setVideoStatus('ready')}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <div className="text-center">
                  <div className={`w-24 h-24 bg-gradient-to-br ${
                    personality.color === 'blue' ? 'from-blue-500 to-blue-700' :
                    personality.color === 'amber' ? 'from-amber-500 to-amber-700' :
                    personality.color === 'emerald' ? 'from-emerald-500 to-emerald-700' :
                    personality.color === 'purple' ? 'from-purple-500 to-purple-700' :
                    'from-pink-500 to-pink-700'
                  } rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-white text-2xl font-bold">
                      {personality.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-white font-medium">Avatar prêt</p>
                  <p className="text-slate-400 text-sm">Commencez une conversation</p>
                </div>
              </div>
            )}

            {/* Video Status Overlay */}
            {videoStatus === 'generating' && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  </motion.div>
                  <p className="text-white font-medium">Génération vidéo...</p>
                  <p className="text-cyan-400 text-sm">Tavus crée votre réponse</p>
                </div>
              </div>
            )}

            {/* Video Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentVideo && (
                  <>
                    <button
                      onClick={videoStatus === 'playing' ? pauseVideo : playVideo}
                      className="w-10 h-10 bg-black/70 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-colors"
                    >
                      {videoStatus === 'playing' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="w-10 h-10 bg-black/70 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {currentVideo && (
                  <>
                    <button
                      onClick={downloadVideo}
                      className="w-10 h-10 bg-black/70 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={shareVideo}
                      className="w-10 h-10 bg-black/70 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={toggleFullscreen}
                      className="w-10 h-10 bg-black/70 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-colors"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {avatarStatus === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/20">
            <div className="text-center">
              <VideoOff className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-white font-medium">Erreur création avatar</p>
              <p className="text-red-400 text-sm">Mode simulation activé</p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Interface */}
      <div className="p-4 bg-slate-800">
        {/* Voice Input */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={toggleListening}
            disabled={avatarStatus !== 'ready'}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' 
                : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
          </button>
          
          <div className="flex-1">
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTextMessage(transcript)}
              placeholder={isListening ? "Parlez maintenant..." : "Tapez votre message ou utilisez le micro"}
              disabled={avatarStatus !== 'ready' || videoStatus === 'generating'}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none disabled:opacity-50"
            />
          </div>
          
          <button
            onClick={() => handleTextMessage(transcript)}
            disabled={!transcript.trim() || avatarStatus !== 'ready' || videoStatus === 'generating'}
            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Envoyer
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${
              avatarStatus === 'ready' ? 'text-green-400' : 
              avatarStatus === 'creating' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                avatarStatus === 'ready' ? 'bg-green-400' : 
                avatarStatus === 'creating' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
              }`} />
              Avatar {avatarStatus === 'ready' ? 'prêt' : avatarStatus === 'creating' ? 'en création' : 'erreur'}
            </div>
            
            {recognitionRef.current && (
              <div className="text-slate-400">
                🎤 Reconnaissance vocale active
              </div>
            )}
          </div>
          
          <button
            onClick={resetConversation}
            disabled={avatarStatus !== 'ready'}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>

        {/* Powered by */}
        <div className="mt-3 pt-3 border-t border-slate-700">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <Video className="w-3 h-3" />
            <span>Powered by Tavus AI • Avatars vidéo ultra-réalistes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TavusVideoChat;