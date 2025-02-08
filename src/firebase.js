// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4fTVJM0CS6RBrIsjW65Y4525kJezRIms",
  authDomain: "nova-ai-450014.firebaseapp.com",
  databaseURL: "https://nova-ai-450014-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nova-ai-450014",
  storageBucket: "nova-ai-450014.firebasestorage.app",
  messagingSenderId: "454543426095",
  appId: "1:454543426095:web:d66880345d133f447cfcda"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export {database};