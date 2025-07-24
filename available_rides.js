// available_rides.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const ridesRef = ref(db, "rides");
const ridesList = document.getElementById("ridesList");
const sharedRidesContainer = document.getElementById("shared-rides");

// Display Booked Rides
function displayRides(snapshot) {
    ridesList.innerHTML = "";
    if (!snapshot.exists()) {
        ridesList.innerHTML = "<p>No available rides.</p>";
        return;
    }
    const data = snapshot.val();
    Object.keys(data).forEach((rideId) => {
        const ride = data[rideId];

        let listItem = document.createElement("div");
        listItem.classList.add("ride-entry");
        listItem.innerHTML = `
            <p><b>Pickup:</b> ${ride.pickup} → <b>Drop:</b> ${ride.drop}</p>
            <p><b>Time:</b> ${ride.time} | <b>Payment:</b> ${ride.payment}</p>
            <button class="cancel-btn" onclick="cancelRide('${rideId}')">Cancel Ride ❌</button>
        `;
        ridesList.appendChild(listItem);
    });
}

// Cancel Ride
window.cancelRide = function (rideId) {
    if (confirm("Are you sure you want to cancel this ride?")) {
        remove(ref(db, "rides/" + rideId))
            .then(() => alert("🚗 Ride canceled successfully!"))
            .catch((error) => alert("⚠️ Failed to cancel ride: " + error.message));
    }
};

// Find Shared Rides
function findMatchingRides(userPickup, userDrop) {
    onValue(ridesRef, (snapshot) => {
        sharedRidesContainer.innerHTML = "";

        if (!snapshot.exists()) {
            sharedRidesContainer.innerHTML = "<p>No shared rides found.</p>";
            return;
        }

        const data = snapshot.val();
        let found = false;

        Object.keys(data).forEach((rideId) => {
            const ride = data[rideId];

            if (
                ride.pickup.toLowerCase().includes(userPickup.toLowerCase()) &&
                ride.drop.toLowerCase().includes(userDrop.toLowerCase())
            ) {
                found = true;
                const rideCard = document.createElement("div");
                rideCard.classList.add("ride-entry");
                rideCard.innerHTML = `
                    <p><b>On-Route Ride:</b> ${ride.pickup} → ${ride.drop}</p>
                    <p><b>Date:</b> ${ride.date} | <b>Time:</b> ${ride.time}</p>
                    <p><b>Fare (approx.):</b> ₹${ride.fare}</p>
                    <button onclick="joinRide('${rideId}')">Join this Ride</button>
                `;
                sharedRidesContainer.appendChild(rideCard);
            }
        });

        if (!found) {
            sharedRidesContainer.innerHTML = "<p>No matching shared rides on this route.</p>";
        }
    });
}

// Join Ride
window.joinRide = function (rideId) {
    alert("✅ You've joined the ride! Please contact the driver for coordination.");
    // Optional: Update Firebase with new passenger data
};

// Attach Event Listener to Form
const searchForm = document.getElementById("searchSharedRideForm");
if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const pickup = document.getElementById("pickup").value;
        const drop = document.getElementById("drop").value;
        findMatchingRides(pickup, drop);
    });
}

// Fetch Booked Rides
onValue(ridesRef, displayRides);