import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';

export const useAuth = () => {
  // Mock user for development
  const mockUser = {
    uid: 'mock-user-id',
    email: 'demo@example.com',
    displayName: 'Demo User',
    photoURL: null,
  } as User;

  return {
    user: mockUser,
    loading: false,
    signIn: async (email: string, password: string) => mockUser,
    signUp: async (email: string, password: string) => mockUser,
    signOut: async () => {},
  };
};
