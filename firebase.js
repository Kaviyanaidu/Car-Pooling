// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ✅ Import the config from a secure local file
import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Register User & Store in Database
window.register = function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Save user data in Realtime Database
            set(ref(database, "users/" + user.uid), {
                email: email
            });

            alert("✅ Signup Successful! Please login.");
        })
        .catch(error => {
            alert("❌ Error: " + error.message);
        });
};

// Login User
window.login = function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("✅ Login Successful!");
            window.location.href = "ride_booking.html"; // Redirect to booking page
        })
        .catch(error => {
            alert("❌ Error: " + error.message);
        });
};
