import 'react-native-get-random-values';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDMx7404THlGd6nonq0wJGO8xat-kYhl-A",
  authDomain: "condlink-263c2.firebaseapp.com",
  databaseURL: "https://condlink-263c2-default-rtdb.firebaseio.com",
  projectId: "condlink-263c2",
  storageBucket: "condlink-263c2.firebasestorage.app",
  messagingSenderId: "320747653954",
  appId: "1:320747653954:android:fcbc77e1b10a90574cd6db"
};

// Evitar inicialização dupla
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Database com configuração específica para Bridgeless
export const db = (() => {
  try {
    const database = getDatabase(app);
    
    // Configuração específica para evitar o erro sendRequest
    if (__DEV__) {
      console.log('Configurando database para Bridgeless mode...');
    }
    
    return database;
  } catch (error) {
    console.error('Erro ao inicializar database:', error);
    return getDatabase(app);
  }
})();

// Auth com fallback
export const auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch (error) {
    console.log('Auth já inicializado, usando getAuth');
    const { getAuth } = require('firebase/auth');
    return getAuth(app);
  }
})();
