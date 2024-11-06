import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth"; // Import persistence functions
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'; // Import getStorage

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrHbVCwPHZ6H9oN4XBm8T9N0ACaz1Aouc",
  authDomain: "loginedsan-41d66.firebaseapp.com",
  databaseURL: "https://loginedsan-41d66-default-rtdb.firebaseio.com",
  projectId: "loginedsan-41d66",
  storageBucket: "loginedsan-41d66.appspot.com",
  messagingSenderId: "115985042941",
  appId: "1:115985042941:web:a472e21ce9d61c881c9d94",
  measurementId: "G-Z89VTDTZFY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Storage

export { auth, db, storage };
