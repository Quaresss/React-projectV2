import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBG4z6kKdpJESLxah453urk6a6H4U9JqPY',
  appId: '1:37276020089:web:e29408766dd9a0a4c853a8',
  authDomain: 'react-e-commerce-164af.firebaseapp.com',
  measurementId: 'G-X5GP0JJZ56',
  messagingSenderId: '37276020089',
  projectId: 'react-e-commerce-164af',
  storageBucket: 'react-e-commerce-164af.firebasestorage.app',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
