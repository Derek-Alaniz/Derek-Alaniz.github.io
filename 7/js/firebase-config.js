  import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";

  import { getDatabase } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js";

  const firebaseConfig = {
    apiKey: "AIzaSyB5gTg1XynlATVhWfCHZ26sGgxrhKgTEJo",
    authDomain: "project5-c3549.firebaseapp.com",
    projectId: "project5-c3549",
    storageBucket: "project5-c3549.firebasestorage.app",
    messagingSenderId: "546243738118",
    appId: "1:546243738118:web:6557aa79079d99af52a187",
    databaseURL: "https://project5-c3549-default-rtdb.firebaseio.com/"
};

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  export default app

  import { getAuth } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

  const auth = getAuth(app);

  const db = getDatabase(app);

  export { db };

  export { auth };