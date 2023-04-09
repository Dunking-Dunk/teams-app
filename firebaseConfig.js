// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfreuhGixAhCrWuUtr4MtGnJC2aTEOKms",
  authDomain: "teams-app-12dd4.firebaseapp.com",
  projectId: "teams-app-12dd4",
  storageBucket: "teams-app-12dd4.appspot.com",
  messagingSenderId: "396909266475",
  appId: "1:396909266475:web:1631226d1c8101cc084c6e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const getAuthClient = getAuth(app);
export const getClientStorage = getStorage(app);
