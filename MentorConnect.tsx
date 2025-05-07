import { useState, useRef } from 'react';
import { useMentorStore } from '../store/mentor';
import { useAuthStore } from '../store/auth'; // Import the auth store
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function MentorConnect() {
  const { user } = useAuthStore(); // Fetch the logged-in user's details
  const { messages, meetings, sendMessage, scheduleMeeting } = useMentorStore();

  const [newMessage, setNewMessage] = useState('');
  const [meetingDetails, setMeetingDetails] = useState({
    parentName: '',
    teacherName: '',
    subject: '',
    time: '',
  });

  const [videoMode, setVideoMode] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const senderRole = user?.role; // Automatically set the sender's role based on the logged-in user

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(senderRole, newMessage);
      setNewMessage('');
    }
  };

  const handleScheduleMeeting = () => {
    const { parentName, teacherName, subject, time } = meetingDetails;
    if (!parentName || !teacherName || !subject || !time) {
      alert('Please fill in all meeting details.');
      return;
    }
    scheduleMeeting(parentName, teacherName, subject, time);
    setMeetingDetails({ parentName: '', teacherName: '', subject: '', time: '' });
    alert('Meeting successfully scheduled!');
  };

  const startVideoCall = async () => {
    setVideoMode(true);

    // Access the local camera and microphone
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    // Set the local video feed
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    // Set the same local feed as the remote feed for simulation
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
    }
  };

  const endCall = () => {
    setVideoMode(false);

    // Stop the video and audio tracks
    if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
    }
    if (remoteVideoRef.current?.srcObject) {
      (remoteVideoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
    }

    // Reset video elements
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  return (
    <div className="space-y-8">
      {!videoMode && (
        <>
          {/* Messaging Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Messaging</h2>
            <div className="space-y-4">
              {/* Message List */}
              <div className="space-y-2 max-h-64 overflow-y-auto border rounded p-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2 rounded ${
                      msg.sender === 'parent' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    <strong>{msg.sender === 'parent' ? 'Parent' : 'Teacher'}:</strong> {msg.content}
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(msg.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* New Message Input */}
              <div className="flex items-center space-x-4">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Type a message as ${senderRole === 'parent' ? 'Parent' : 'Teacher'}...`}
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </div>
          </div>

          {/* Meeting Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Schedule a Meeting</h2>
            <div className="space-y-4">
              {/* Meeting Form */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={meetingDetails.parentName}
                  onChange={(e) => setMeetingDetails({ ...meetingDetails, parentName: e.target.value })}
                  placeholder="Parent Name"
                />
                <Input
                  value={meetingDetails.teacherName}
                  onChange={(e) => setMeetingDetails({ ...meetingDetails, teacherName: e.target.value })}
                  placeholder="Teacher Name"
                />
                <Input
                  value={meetingDetails.subject}
                  onChange={(e) => setMeetingDetails({ ...meetingDetails, subject: e.target.value })}
                  placeholder="Subject"
                />
                <Input
                  type="datetime-local"
                  value={meetingDetails.time}
                  onChange={(e) => setMeetingDetails({ ...meetingDetails, time: e.target.value })}
                  placeholder="Scheduled Time"
                />
              </div>
              <Button onClick={handleScheduleMeeting}>Schedule</Button>
            </div>

            {/* Meeting List */}
            <div className="mt-6 space-y-2 max-h-64 overflow-y-auto border rounded p-4">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="p-4 bg-gray-100 rounded">
                  <div>
                    <strong>Subject:</strong> {meeting.subject}
                  </div>
                  <div>
                    <strong>Scheduled Time:</strong>{' '}
                    {new Date(meeting.scheduledTime).toLocaleString()}
                  </div>
                  <Button onClick={startVideoCall}>Join Meeting</Button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Video Call Section */}
      {videoMode && (
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg">
          <div>
            <h3 className="text-lg font-semibold mb-2">Your Video</h3>
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              className="w-full h-auto border rounded"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Remote Video</h3>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-auto border rounded"
            />
          </div>
          <Button onClick={endCall} className="col-span-2">
            End Call
          </Button>
        </div>
      )}
    </div>
  );
}
