import { create } from 'zustand';
import { generateId } from '../lib/utils';
import { jsPDF } from 'jspdf';
import { LectureNote, LectureStore } from '../types/lecture';

export const useLectureStore = create<LectureStore>((set, get) => ({
  notes: [],

  addNote: (noteData) => {
    // Generate PDF from content
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(noteData.title, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Subject: ${noteData.subject}`, 20, 30);
    doc.text(`Teacher: ${noteData.teacherName}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    
    doc.setFontSize(10);
    doc.text('Transcription:', 20, 70);
    const transcriptionLines = doc.splitTextToSize(noteData.content, 170);
    doc.text(transcriptionLines, 20, 80);

    doc.addPage();
    doc.setFontSize(12);
    doc.text('AI-Generated Summary:', 20, 20);
    const summaryLines = doc.splitTextToSize(noteData.summary, 170);
    doc.text(summaryLines, 20, 30);
    
    // Create PDF URL
    const pdfUrl = URL.createObjectURL(
      new Blob([doc.output('blob')], { type: 'application/pdf' })
    );

    const note: LectureNote = {
      id: generateId(),
      ...noteData,
      pdfUrl,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      notes: [...state.notes, note],
    }));

    // Store in localStorage
    const storedNotes = JSON.parse(localStorage.getItem('lectureNotes') || '[]');
    localStorage.setItem('lectureNotes', JSON.stringify([...storedNotes, note]));
  },

  getLectureNotes: () => {
    return get().notes;
  },

  getTeacherNotes: (teacherId) => {
    return get().notes.filter((note) => note.teacherId === teacherId);
  },

  downloadPDF: (noteId) => {
    const note = get().notes.find((n) => n.id === noteId);
    if (note?.pdfUrl) {
      const link = document.createElement('a');
      link.href = note.pdfUrl;
      link.download = `${note.title.replace(/\s+/g, '_')}_lecture_notes.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },

  initNotes: () => {
    const storedNotes = JSON.parse(localStorage.getItem('lectureNotes') || '[]');
    set({ notes: storedNotes });
  },
}));

// Initialize notes when the store is created
useLectureStore.getState().initNotes();