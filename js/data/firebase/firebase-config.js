import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDXIQlaySSQhyCDjZaMjn05iONerqQ5yo4",
  authDomain: "lsj-web-project.firebaseapp.com",
  projectId: "lsj-web-project",
  storageBucket: "lsj-web-project.firebasestorage.app",
  messagingSenderId: "54655104434",
  appId: "1:54655104434:web:5175d13a82c81a4c7ba0ab",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export { onAuthStateChanged };
