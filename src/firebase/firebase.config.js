// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrmx8TqIRox56CpN5YSZeTV_rIx9SJFSg",
  authDomain: "job-task-client-778cf.firebaseapp.com",
  projectId: "job-task-client-778cf",
  storageBucket: "job-task-client-778cf.firebasestorage.app",
  messagingSenderId: "71321824312",
  appId: "1:71321824312:web:611e753c14daeac6220acd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;