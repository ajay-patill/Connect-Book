// src/pages/ParentDashboard.tsx
import { useState } from 'react';

export function ParentDashboard() {
  const [studentEmail, setStudentEmail] = useState('');

  const studentData = {
    name: 'Poorna',
    usn: '1VE22IS001',
    semester: '4th Semester',
    grades: [
      { subject: 'Mathematics', grade: 100 },
      { subject: 'Computer Science', grade: 100 },
      { subject: 'Electrical Engineering', grade: 100 },
      { subject: 'Mechanics', grade: 100 },
      { subject: 'Civil Engineering', grade: 100 },
    ],
    lectureNotes: [
      { subject: 'Mathematics', notes: 'Lecture on Integration Techniques' },
      { subject: 'Computer Science', notes: 'Lecture on Data Structures' },
      { subject: 'Electrical Engineering', notes: 'Lecture on Circuit Theorems' },
      { subject: 'Mechanics', notes: 'Lecture on Newton’s Laws' },
      { subject: 'Civil Engineering', notes: 'Lecture on Structural Analysis' },
    ],
    events: [
      'Annual Tech Fest',
      'Sports Day',
      'Cultural Festival',
      'Guest Lecture on AI',
      'Robotics Workshop',
      'Coding Marathon',
      'Science Expo',
      'Inter-College Debate Competition',
      'Music and Dance Night',
      'Career Counselling Session',
    ]
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Parent Dashboard</h1>

      {/* Student Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Student Information</h2>
        <div className="space-y-4">
          <div>
            <p><strong>Name:</strong> {studentData.name}</p>
            <p><strong>USN:</strong> {studentData.usn}</p>
            <p><strong>Semester:</strong> {studentData.semester}</p>
          </div>
        </div>
      </div>

      {/* Display Grades */}
      {studentData.grades.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Grades</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {studentData.grades.map((grade, index) => (
                  <tr key={index}>
                    <td>{grade.subject}</td>
                    <td>{grade.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Display Lecture Notes */}
      {studentData.lectureNotes.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Lecture Notes</h2>
          <div className="space-y-4">
            {studentData.lectureNotes.map((note, index) => (
              <div key={index}>
                <h3 className="font-medium">{note.subject}</h3>
                <p>{note.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display College Events */}
      {studentData.events.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming College Events</h2>
          <div className="space-y-2">
            {studentData.events.map((event, index) => (
              <div key={index} className="border-b py-2">
                <p>{event}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
