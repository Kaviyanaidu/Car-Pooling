import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { firebaseConfig } from "./config.js"; // 👈 Load config securely

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to Confirm Ride and Store in Firebase
export function confirmRide() {
    let userType = document.getElementById("userType").value;
    let pickup = document.getElementById("pickup").value;
    let drop = document.getElementById("drop").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let payment = document.getElementById("payment").value;

    if (!pickup || !drop || !date || !time) {
        alert("⚠️ Please fill all details!");
        return;
    }

    let rideData = {
        userType,
        pickup,
        drop,
        date,
        time,
        payment
    };

    // Push Data to Firebase
    const rideRef = ref(database, "rides");
    push(rideRef, rideData)
        .then(() => {
            alert("✅ Ride Successfully Booked!");
        })
        .catch((error) => {
            alert("❌ Error Booking Ride: " + error.message);
        });
}
