import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader } from 'lucide-react';
import { Button } from '../ui/Button';

interface AudioRecorderProps {
  onRecordingComplete: (audioUrl: string, audioBlob: Blob, transcription: string) => void;
}

export function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      setTranscription('');
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      streamRef.current = stream;
      
      // Initialize speech recognition
      if ('webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setTranscription(prev => prev + ' ' + finalTranscript);
          }
        };
        
        recognition.start();
      }
      
      // Create MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        
        onRecordingComplete(audioUrl, audioBlob, transcription.trim());
        
        // Cleanup
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
        }
        setDuration(0);
        setIsRecording(false);
      };

      // Start recording
      mediaRecorder.start(1000);
      setIsRecording(true);

      // Start duration timer
      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Could not access microphone. Please ensure microphone permissions are granted.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-start space-y-4">
      <div className="flex items-center space-x-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            className="flex items-center"
            variant="outline"
          >
            <Mic className="h-4 w-4 mr-2" />
            Start Recording
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            className="flex items-center"
            variant="outline"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop Recording
          </Button>
        )}
        {isRecording && (
          <div className="flex items-center space-x-2">
            <Loader className="h-4 w-4 animate-spin text-red-500" />
            <span className="text-sm font-medium">{formatDuration(duration)}</span>
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      {isRecording && (
        <>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 animate-pulse" style={{ width: '100%' }} />
          </div>
          {transcription && (
            <div className="w-full p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">Live Transcription:</p>
              <p className="text-sm mt-1">{transcription}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Add TypeScript declaration for webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}