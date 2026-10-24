import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBR15lTH5BJC6KOh8_KiUeCtgGfmSEk10I',
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDomain || 't-shirt-7d3a2.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 't-shirt-7d3a2',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 't-shirt-7d3a2.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '570443748090',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:570443748090:web:1bf2367747a6766dbaaf43',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-MLX7GDVVDS'
};

// Initialize Firebase App for project services
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
