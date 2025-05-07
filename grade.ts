import { create } from 'zustand';
import { GradeStore, Grade, Document } from '../types/grade';
import { extractTextFromFile, compareDocumentsWordBased } from '../lib/documentProcessor';

export const useGradeStore = create<GradeStore>((set, get) => ({
  documents: [],
  grades: [],
  processingStatus: null,
  error: null,

  uploadDocument: async (file: File, uploadedBy: string, subject?: string) => {
    try {
      set({ processingStatus: 'Extracting text from document...', error: null });

      const content = await extractTextFromFile(file);

      const document: Document = {
        id: `${new Date().getTime()}`,
        name: file.name,
        url: URL.createObjectURL(file),
        content,
        uploadedBy,
        subject,
        createdAt: new Date().toISOString(),
      };

      set((state) => ({
        documents: [...state.documents, document],
        processingStatus: null,
      }));

      return document;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload document';
      console.error(errorMessage);
      set({ processingStatus: null, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  compareAndGrade: async (teacherDocId, studentDocId, studentId, studentName, subject) => {
    try {
      set({ processingStatus: 'Comparing documents...', error: null });

      const { documents } = get();
      const teacherDoc = documents.find((doc) => doc.id === teacherDocId);
      const studentDoc = documents.find((doc) => doc.id === studentDocId);

      if (!teacherDoc || !studentDoc) throw new Error('Documents not found');

      const comparison = compareDocumentsWordBased(teacherDoc.content, studentDoc.content);

      const grade: Grade = {
        id: `${new Date().getTime()}`,
        studentId,
        studentName,
        subject,
        score: comparison.score,
        matchedWords: comparison.matchedWords,
        totalWords: comparison.totalWords,
        teacherDocumentId: teacherDocId,
        studentDocumentId: studentDocId,
        highlightedContent: comparison.highlightedContent,
        createdAt: new Date().toISOString(),
      };

      set((state) => ({ grades: [...state.grades, grade], processingStatus: null }));
      return grade;
    } catch (error) {
      console.error('Error comparing documents:', error);
      set({ processingStatus: null, error: 'Failed to compare documents.' });
      throw new Error('Failed to compare documents.');
    }
  },

  getStudentGrades: (studentId) => {
    const { grades } = get();
    return grades.filter((grade) => grade.studentId === studentId);
  },

  getTeacherDocuments: () => {
    const { documents } = get();
    return documents.filter((doc) => doc.uploadedBy === 'teacher');
  },

  downloadGradeReport: () => {
    const { grades } = get();
    const csvContent = [
      'Student Name,Subject,Score,Matched Words,Total Words,Date',
      ...grades.map((grade) =>
        `${grade.studentName},${grade.subject},${grade.score},${grade.matchedWords},${grade.totalWords},${new Date(
          grade.createdAt
        ).toLocaleDateString()}`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'grades.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  clearError: () => set({ error: null }),
}));
