// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGCDpe1KKgFXaKMTSCc7XrJ3M-T5uvA20",
  authDomain: "uploadingresume-da657.firebaseapp.com",
  projectId: "uploadingresume-da657",
  storageBucket: "uploadingresume-da657.appspot.com",
  messagingSenderId: "926689184977",
  appId: "1:926689184977:web:44d8baea32b6342c4f49f0",
  measurementId: "G-0DSWKC6LM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);