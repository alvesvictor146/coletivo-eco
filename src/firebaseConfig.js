import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "coletivo-eco-site",
  appId: "1:343808692769:web:e191dd34a1d42211a38960",
  storageBucket: "coletivo-eco-site.firebasestorage.app",
  apiKey: "AIzaSyAFJsHsZpLUL6XiOug9NWHBn5XqGKlj57c",
  authDomain: "coletivo-eco-site.firebaseapp.com",
  messagingSenderId: "343808692769"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
