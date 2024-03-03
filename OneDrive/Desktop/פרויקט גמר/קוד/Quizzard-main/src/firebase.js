// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGkDn9M7Z3_VtnzB7F6TrO0EBgAz8MOko",
  authDomain: "quizzard-a28aa.firebaseapp.com",
  projectId: "quizzard-a28aa",
  storageBucket: "quizzard-a28aa.appspot.com",
  messagingSenderId: "935026105625",
  appId: "1:935026105625:web:036d59a694d058565fb988",
  measurementId: "G-H89C28GWBZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

export const fetchUserData = async (userId) => {
  const database = getDatabase();
  const userRef = ref(database, `users/${userId}`);
  const snapshot = await get(userRef);
  return snapshot.val();
};

export const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in.
    console.log("User is signed in:", user);
  } else {
    // No user is signed in.
    console.log("No user is signed in.");
  }
});
export default firebaseConfig;
