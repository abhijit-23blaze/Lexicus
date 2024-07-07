// firebase.js
import firebase from "firebase/app";
import "firebase/auth";

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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
