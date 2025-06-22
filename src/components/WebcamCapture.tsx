import React, { useRef, useEffect } from 'react';
import { Camera, RotateCcw, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWebcam } from '../hooks/useWebcam';

interface WebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  className?: string;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    isActive,
    capturedImage,
    startWebcam,
    capturePhoto,
    stopWebcam,
    retakePhoto
  } = useWebcam();

  useEffect(() => {
    if (videoRef.current && isActive) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(console.error);
    }
  }, [isActive]);

  useEffect(() => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  }, [capturedImage, onCapture]);

  const handleCapture = () => {
    capturePhoto();
  };

  const handleRetake = () => {
    retakePhoto();
  };

  return (
    <div className={`relative ${className}`}>
      {!isActive && !capturedImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800/50 backdrop-blur rounded-xl p-8 text-center border-2 border-dashed border-slate-600"
        >
          <Camera className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Prendre une photo</h3>
          <p className="text-slate-400 mb-6">
            Utilise ta webcam pour capturer une photo de profil
          </p>
          <motion.button
            onClick={startWebcam}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Démarrer la caméra
          </motion.button>
        </motion.div>
      )}

      {isActive && !capturedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative"
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 object-cover rounded-xl bg-slate-800"
          />
          
          {/* Overlay avec guide de cadrage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-white/50 rounded-full"></div>
          </div>
          
          {/* Contrôles */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
            <motion.button
              onClick={stopWebcam}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Annuler
            </motion.button>
            <motion.button
              onClick={handleCapture}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Camera className="w-4 h-4" />
              Capturer
            </motion.button>
          </div>
        </motion.div>
      )}

      {capturedImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <img
            src={capturedImage}
            alt="Photo capturée"
            className="w-full h-64 object-cover rounded-xl"
          />
          
          {/* Contrôles */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
            <motion.button
              onClick={handleRetake}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="w-4 h-4" />
              Reprendre
            </motion.button>
            <motion.button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Check className="w-4 h-4" />
              Valider
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WebcamCapture;