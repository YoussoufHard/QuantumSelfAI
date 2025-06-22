import React from 'react';
import { Mic, MicOff, Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { ElevenLabsService } from '../services/elevenlabs';
import AudioPlayer from './AudioPlayer';
import toast from 'react-hot-toast';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, voiceId?: string) => void;
  maxDuration?: number;
  className?: string;
  userName?: string;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onRecordingComplete, 
  maxDuration = 10,
  className = '',
  userName = 'User'
}) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [voiceId, setVoiceId] = React.useState<string | null>(null);
  
  const {
    isRecording,
    recordingTime,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording
  } = useAudioRecorder();

  React.useEffect(() => {
    if (audioBlob && !isProcessing) {
      handleVoiceCloning();
    }
  }, [audioBlob]);

  const handleVoiceCloning = async () => {
    if (!audioBlob) return;
    
    setIsProcessing(true);
    toast.loading('🎤 Clonage vocal ElevenLabs...', { id: 'voice-clone' });

    try {
      const result = await ElevenLabsService.cloneVoice(audioBlob, userName);
      setVoiceId(result.voiceId);
      
      if (result.status === 'ready') {
        toast.success('✨ Voix clonée avec succès !', { id: 'voice-clone' });
      } else {
        toast.success('🎵 Voix en cours de traitement', { id: 'voice-clone' });
      }
      
      onRecordingComplete(audioBlob, result.voiceId);
    } catch (error) {
      console.error('Erreur clonage vocal:', error);
      toast.error('Erreur clonage, mode fallback activé', { id: 'voice-clone' });
      onRecordingComplete(audioBlob);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-slate-800/50 backdrop-blur rounded-xl p-6 ${className}`}>
      <div className="text-center">
        {!audioBlob ? (
          <>
            {/* Bouton d'enregistrement */}
            <motion.button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 ${
                isRecording 
                  ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' 
                  : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={recordingTime >= maxDuration}
            >
              {isRecording ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </motion.button>

            {/* Indicateur de temps */}
            <div className="mb-4">
              <div className="text-2xl font-bold text-white mb-2">
                {formatTime(recordingTime)} / {formatTime(maxDuration)}
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(recordingTime / maxDuration) * 100}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            {/* Instructions */}
            <p className="text-slate-300 text-sm mb-4">
              {isRecording 
                ? 'Enregistrement en cours... Parle clairement' 
                : 'Appuie pour commencer l\'enregistrement vocal'
              }
            </p>
            
            <div className="text-xs text-slate-400 mb-4">
              🎤 Clonage vocal ElevenLabs activé
            </div>

            {/* Visualiseur audio (simulation) */}
            {isRecording && (
              <div className="flex items-center justify-center gap-1 mt-4">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-blue-400 rounded-full"
                    animate={{
                      height: [4, Math.random() * 20 + 4, 4],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Lecture de l'enregistrement */}
            <div className="mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isProcessing ? 'bg-amber-500 animate-pulse' : 'bg-green-500'
              }`}>
                {isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Mic className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {isProcessing ? 'Clonage ElevenLabs...' : 'Enregistrement terminé !'}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Durée: {formatTime(recordingTime)}
                {voiceId && (
                  <span className="block text-green-400 text-xs mt-1">
                    ✅ Voix clonée: {voiceId.substring(0, 8)}...
                  </span>
                )}
              </p>
            </div>

            {/* Lecteur audio */}
            <AudioPlayer audioBlob={audioBlob} className="mb-4" />

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <motion.button
                onClick={resetRecording}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-4 h-4" />
                Recommencer
              </motion.button>
            </div>
            
            {isProcessing && (
              <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <div className="text-amber-400 text-xs font-medium mb-1">
                  🎵 ElevenLabs Processing...
                </div>
                <div className="text-slate-300 text-xs">
                  Clonage vocal en cours avec le client officiel ElevenLabs
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;