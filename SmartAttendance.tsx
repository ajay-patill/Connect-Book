import { useState } from 'react';
import { Camera, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/auth';
import { useAttendanceStore } from '../store/attendance';
import { WebCamera } from '../components/camera/WebCamera';

export function SmartAttendance() {
  const [usn, setUsn] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  
  const { user } = useAuthStore();
  const { markAttendance, getAttendanceRecords, downloadReport } = useAttendanceStore();
  
  const isTeacher = user?.role === 'teacher';
  const attendanceRecords = getAttendanceRecords();

  const handlePhotoCapture = (imageUrl: string) => {
    setPhotoUrl(imageUrl);
    setShowCamera(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && photoUrl) {
      await markAttendance({
        usn,
        studentId: user.id,
        studentName: user.name,
        photoUrl,
      });
      // Reset form
      setUsn('');
      setPhotoUrl(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isTeacher ? 'Attendance Records' : 'Mark Attendance'}
        </h1>
        {isTeacher && (
          <div className="space-x-4">
            <Button onClick={() => downloadReport('pdf')} className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={() => downloadReport('excel')} className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download Excel
            </Button>
          </div>
        )}
      </div>

      {!isTeacher && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">USN</label>
              <Input
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                placeholder="Enter your USN"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Photo</label>
              <div className="flex items-center space-x-4">
                {photoUrl ? (
                  <div className="relative w-32 h-32">
                    <img
                      src={photoUrl}
                      alt="Attendance"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl(null)}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/2 -translate-y-1/2"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setShowCamera(true)}
                    className="flex items-center"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                )}
              </div>
            </div>
            <Button type="submit" disabled={!photoUrl || !usn}>
              Mark Attendance
            </Button>
          </form>
        </div>
      )}

      {showCamera && (
        <WebCamera
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">
          {isTeacher ? 'All Attendance Records' : 'Your Attendance History'}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  USN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceRecords
                .filter((record) => !isTeacher ? record.studentId === user?.id : true)
                .map((record) => {
                  const date = new Date(record.timestamp);
                  return (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.usn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {date.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {date.toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <img
                          src={record.photoUrl}
                          alt="Attendance"
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}