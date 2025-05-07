import { create } from 'zustand';
import { MentorStore, Message, Meeting } from '../types/mentor';

export const useMentorStore = create<MentorStore>((set, get) => ({
  messages: [],
  meetings: [],

  sendMessage: (sender, content) => {
    const newMessage: Message = {
      id: `${new Date().getTime()}`,
      sender,
      content,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  scheduleMeeting: (parentName, teacherName, subject, time) => {
    const newMeeting: Meeting = {
      id: `${new Date().getTime()}`,
      parentName,
      teacherName,
      subject,
      scheduledTime: time,
      status: 'pending',
    };
    set((state) => ({
      meetings: [...state.meetings, newMeeting],
    }));
  },

  updateMeetingStatus: (meetingId, status) => {
    set((state) => ({
      meetings: state.meetings.map((meeting) =>
        meeting.id === meetingId ? { ...meeting, status } : meeting
      ),
    }));
  },
}));
