// store/chat.ts
import { create } from 'zustand';
import { ChatMessage } from '../types';
import { faqData } from '../data/faq';
import { generateId } from '../lib/utils';

interface ChatState {
  messages: ChatMessage[];
  addMessage: (content: string, sender: 'user' | 'bot') => void;
  processUserMessage: (content: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],

  addMessage: (content: string, sender: 'user' | 'bot') => {
    const message: ChatMessage = {
      id: generateId(),
      content,
      sender,
      timestamp: new Date(),
    };
    set((state) => ({ messages: [...state.messages, message] }));
  },

  processUserMessage: (content: string) => {
    const { addMessage } = get();
    addMessage(content, 'user');

    // Lowercase content for case-insensitive comparison
    const lowercaseContent = content.toLowerCase();

    // Try to find a matching FAQ using partial matching
    const matchingFaq = faqData.find((faq) => {
      return (
        faq.question.toLowerCase().includes(lowercaseContent) ||
        faq.answer.toLowerCase().includes(lowercaseContent)
      );
    });

    if (matchingFaq) {
      addMessage(matchingFaq.answer, 'bot');
    } else {
      addMessage(
        "I'm sorry, I couldn't find a specific answer to your question. Please try rephrasing or contact support for more help.",
        'bot'
      );
    }
  },
}));
