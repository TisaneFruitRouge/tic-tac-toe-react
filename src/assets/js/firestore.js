// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAEIQWakBFnLm59lAo5LVf9Dyf7AIuFm_A",
  authDomain: "tic-tac-toe-react-9ac47.firebaseapp.com",
  projectId: "tic-tac-toe-react-9ac47",
  storageBucket: "tic-tac-toe-react-9ac47.appspot.com",
  messagingSenderId: "43999232923",
  appId: "1:43999232923:web:0856fe6eaa6b3ef846d73e",
  measurementId: "G-2ZZXNGB2MF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


export default db