export interface AttendanceRecord {
  id: string;
  usn: string;
  studentId: string;
  studentName: string;
  photoUrl: string;
  timestamp: string;
}

export interface AttendanceStore {
  records: AttendanceRecord[];
  markAttendance: (record: Omit<AttendanceRecord, 'id' | 'timestamp'>) => void;
  getAttendanceRecords: () => AttendanceRecord[];
  getStudentAttendance: (studentId: string) => AttendanceRecord[];
  downloadReport: (format: 'pdf' | 'excel') => void;
  initAttendance: () => void;
}