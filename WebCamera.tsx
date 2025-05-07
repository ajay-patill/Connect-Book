import { useRef, useCallback, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface WebCameraProps {
  onCapture: (imageUrl: string) => void;
  onClose: () => void;
}

export function WebCamera({ onCapture, onClose }: WebCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageUrl = canvas.toDataURL('image/jpeg');
        onCapture(imageUrl);
        stopCamera();
        onClose();
      }
    }
  }, [onCapture, stopCamera, onClose]);

  // Start camera when component mounts
  useState(() => {
    startCamera();
    return () => stopCamera();
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-4 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Take Photo</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              stopCamera();
              onClose();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex justify-center">
          <Button onClick={capturePhoto} className="flex items-center">
            <Camera className="h-4 w-4 mr-2" />
            Capture Photo
          </Button>
        </div>
      </div>
    </div>
  );
}