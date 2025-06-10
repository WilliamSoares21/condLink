import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDMx7404THlGd6nonq0wJGO8xat-kYhl-A",
  authDomain: "condlink-263c2.firebaseapp.com",
  databaseURL: "https://condlink-263c2-default-rtdb.firebaseio.com",
  projectId: "condlink-263c2",
  storageBucket: "condlink-263c2.firebasestorage.app",
  messagingSenderId: "320747653954",
  appId: "1:320747653954:android:fcbc77e1b10a90574cd6db"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);
