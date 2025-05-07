import { create } from 'zustand';
import { AuthState, User } from '../types';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      // In a real app, this would be an API call
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const user = storedUsers.find((u: User) => u.email === email);
      
      if (!user) {
        throw new Error('User not found');
      }

      // In a real app, we would hash and compare passwords
      set({ user, isAuthenticated: true });
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (email: string, password: string, name: string, role: User['role']) => {
    try {
      // In a real app, this would be an API call
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (storedUsers.some((u: User) => u.email === email)) {
        throw new Error('Email already registered');
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role,
        createdAt: new Date(),
      };

      // Store the new user
      localStorage.setItem('users', JSON.stringify([...storedUsers, newUser]));
      
      // Don't automatically log in after registration
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('currentUser');
  },

  // Initialize the auth state from localStorage
  initAuth: () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      set({ user, isAuthenticated: true });
    }
  },
}));

// Initialize auth state when the store is created
useAuthStore.getState().initAuth();