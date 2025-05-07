import { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/auth';
import { useLectureStore } from '../store/lecture';
import { AudioRecorder } from '../components/lecture/AudioRecorder';
import { generateLectureSummary } from '../lib/aiService';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export function LectureNotes() {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<string | null>(null);
  
  const { user } = useAuthStore();
  const { addNote, getLectureNotes, downloadPDF } = useLectureStore();
  
  const isTeacher = user?.role === 'teacher';
  const lectureNotes = getLectureNotes();

  // Speech Recognition Hooks
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `Lecture transcription for ${title}:\n\n` +
           `This is a simulated transcription of the recorded lecture about ${subject}.`;
  };

  const handleRecordingComplete = async (audioUrl: string, audioBlob: Blob) => {
    if (!user || !title || !subject) {
      setRecordingStatus('Please fill in the title and subject before recording.');
      return;
    }

    setRecordingStatus('Processing recording...');
    setIsTranscribing(true);

    try {
      const transcribedText = await transcribeAudio(audioBlob);
      setContent(transcribedText);

      setIsGeneratingSummary(true);
      setRecordingStatus('Generating AI summary...');
      const aiSummary = await generateLectureSummary(title, subject, transcribedText);
      setSummary(aiSummary);

      addNote({
        title,
        content: transcribedText,
        summary: aiSummary,
        teacherId: user.id,
        teacherName: user.name,
        subject,
        audioUrl,
      });

      setRecordingStatus('Recording processed successfully!');
      
      // Reset form after a delay
      setTimeout(() => {
        setTitle('');
        setSubject('');
        setContent('');
        setSummary('');
        setRecordingStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Error processing recording:', error);
      setRecordingStatus('Error processing recording. Please try again.');
    } finally {
      setIsTranscribing(false);
      setIsGeneratingSummary(false);
    }
  };

  useEffect(() => {
    // Start speech recognition when the recording starts
    if (listening) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }

    // Reset the transcript when the recording is stopped
    return () => resetTranscript();
  }, [listening, resetTranscript]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Lecture Notes</h1>
      </div>

      {isTeacher && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Record New Lecture</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter lecture title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject"
                required
              />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <AudioRecorder onRecordingComplete={handleRecordingComplete} />
              {recordingStatus && (
                <div className={`mt-2 text-sm ${
                  recordingStatus.includes('Error') ? 'text-red-500' : 'text-blue-600'
                }`}>
                  {recordingStatus}
                </div>
              )}
            </div>
            {(isTranscribing || isGeneratingSummary) && (
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                <span>
                  {isTranscribing ? 'Transcribing audio...' : 'Generating AI summary...'}
                </span>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Real-time Transcription</label>
              <div className="mt-1 p-4 bg-gray-50 rounded-md">
                <pre className="text-sm whitespace-pre-wrap">{transcript}</pre>
              </div>
            </div>
            {content && (
              <div>
                <label className="block text-sm font-medium mb-1">Transcription Preview</label>
                <div className="mt-1 p-4 bg-gray-50 rounded-md">
                  <pre className="text-sm whitespace-pre-wrap">{content}</pre>
                </div>
              </div>
            )}
            {summary && (
              <div>
                <label className="block text-sm font-medium mb-1">AI-Generated Summary</label>
                <div className="mt-1 p-4 bg-gray-50 rounded-md">
                  <pre className="text-sm whitespace-pre-wrap">{summary}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Lecture Notes</h2>
        <div className="space-y-4">
          {lectureNotes.map((note) => (
            <div
              key={note.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{note.title}</h3>
                  <p className="text-sm text-gray-500">
                    {note.subject} - {note.teacherName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(note.timestamp).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => downloadPDF(note.id)}
                  className="flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
              {note.audioUrl && (
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">Audio Recording</label>
                  <audio controls className="w-full">
                    <source src={note.audioUrl} type="audio/webm" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">Transcription</label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <pre className="text-sm whitespace-pre-wrap">{note.content}</pre>
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">AI Summary</label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <pre className="text-sm whitespace-pre-wrap">{note.summary}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
