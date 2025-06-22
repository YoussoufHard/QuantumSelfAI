import { useState, useRef, useCallback } from 'react';

export interface WebcamHook {
  isActive: boolean;
  capturedImage: string | null;
  startWebcam: () => Promise<void>;
  capturePhoto: () => void;
  stopWebcam: () => void;
  retakePhoto: () => void;
}

export const useWebcam = (): WebcamHook => {
  const [isActive, setIsActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      streamRef.current = stream;
      setIsActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Erreur accès caméra:', error);
      alert('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && streamRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        
        context.drawImage(videoRef.current, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        setCapturedImage(imageDataUrl);
        stopWebcam();
      }
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
  }, []);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startWebcam();
  }, [startWebcam]);

  return {
    isActive,
    capturedImage,
    startWebcam,
    capturePhoto,
    stopWebcam,
    retakePhoto
  };
};