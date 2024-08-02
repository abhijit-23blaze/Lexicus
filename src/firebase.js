// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2ypInj-9BT-TOf7qn59CeU2PbYFXvfBc",
  authDomain: "lexicus-f7fbd.firebaseapp.com",
  projectId: "lexicus-f7fbd",
  storageBucket: "lexicus-f7fbd.appspot.com",
  messagingSenderId: "446886346216",
  appId: "1:446886346216:web:74c176b53322b7a132f85d",
  measurementId: "G-RWVQJ6SCEN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, googleProvider, firestore, storage };
