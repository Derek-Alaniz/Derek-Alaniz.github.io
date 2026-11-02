
import { auth } from "./firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.documentElement.hidden = false;
    } else {
        window.location.replace("index.html");
    }
});
