import { useState, useRef } from 'react';
import { Upload, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useGradeStore } from '../store/grade';
import { Document } from '../types/grade';

export function GradeMaster() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [teacherDocument, setTeacherDocument] = useState<Document | null>(null);
  const [studentDocument, setStudentDocument] = useState<Document | null>(null);
  const [highlightedContent, setHighlightedContent] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const { uploadDocument, compareAndGrade, grades } = useGradeStore();

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    role: 'teacher' | 'student'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setProcessingStatus(`Uploading ${role} document...`);
      const uploadedDoc = await uploadDocument(file, role, selectedSubject);

      if (role === 'teacher') {
        setTeacherDocument(uploadedDoc);
      } else {
        setStudentDocument(uploadedDoc);

        if (teacherDocument) {
          const grade = await compareAndGrade(
            teacherDocument.id,
            uploadedDoc.id,
            'student-id-placeholder', // Replace with the actual student ID
            'Student Name Placeholder', // Replace with the actual student name
            selectedSubject
          );
          setHighlightedContent(grade.highlightedContent);
          alert(`Comparison completed! Score: ${grade.score}%`);
        }
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to process the file. Please try again.');
    } finally {
      setProcessingStatus(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Grade Master</h1>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Upload Documents for Comparison</h2>
        <div className="space-y-4">
          {/* Subject Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <Input
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              placeholder="Enter subject name"
              required
            />
          </div>

          {/* File Upload Buttons */}
          {!teacherDocument && (
            <div>
              <label className="block text-sm font-medium mb-1">Upload Teacher Document</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileUpload(e, 'teacher')}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <Button onClick={() => fileInputRef.current?.click()} className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload Teacher Document
              </Button>
            </div>
          )}

          {teacherDocument && !studentDocument && (
            <div>
              <label className="block text-sm font-medium mb-1">Upload Student Document</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileUpload(e, 'student')}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <Button onClick={() => fileInputRef.current?.click()} className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload Student Document
              </Button>
            </div>
          )}

          {/* Processing Status */}
          {processingStatus && (
            <div className="text-sm text-blue-600">{processingStatus}</div>
          )}

          {/* Highlighted Content */}
          {highlightedContent && (
            <div className="text-sm text-green-600">
              Comparison completed! You can view the highlighted document below.
            </div>
          )}
        </div>
      </div>

      {/* Highlighted Document */}
      {highlightedContent && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Highlighted Student Document</h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: highlightedContent }}
          />
        </div>
      )}

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Results</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {grades.map((grade) => (
                <tr key={grade.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {grade.studentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {grade.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {grade.score}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHighlightedContent(grade.highlightedContent)}
                      className="flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
