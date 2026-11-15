import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIF_y_89-RPxudvdi6S8SU0FLY3buzmqY",
  authDomain: "vehiculos-65164.firebaseapp.com",
  projectId: "vehiculos-65164",
  storageBucket: "vehiculos-65164.firebasestorage.app",
  messagingSenderId: "267753930803",
  appId: "1:267753930803:web:98b0c98d468de2988ce346",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export { db };
