import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { firebaseConfig } from "./config.js";

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}
const database = getDatabase(app);

// Known cities and coordinates
const cityCoordinates = {
    "chennai": [13.0827, 80.2707],
    "bangalore": [12.9716, 77.5946],
    "vellore": [12.9165, 79.1325],
    "mumbai": [19.0760, 72.8777],
    "delhi": [28.6139, 77.2090],
    "salem": [11.6643, 78.1460]
};

// Extract city name from input string
function extractCity(address) {
    const lowerAddress = address.toLowerCase();
    for (const city in cityCoordinates) {
        if (lowerAddress.includes(city)) {
            return city;
        }
    }
    return null;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function estimateFare(distance) {
    return 20 + (10 * distance); // ₹20 base fare + ₹10/km
}

document.getElementById("rideForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const pickupInput = document.getElementById("pickup").value.trim();
    const dropInput = document.getElementById("drop").value.trim();
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const payment = document.getElementById("payment").value;

    if (!pickupInput || !dropInput || !date || !time || !payment) {
        Swal.fire("⚠️ Missing Details", "Please fill in all ride details!", "warning");
        return;
    }

    const pickupCity = extractCity(pickupInput);
    const dropCity = extractCity(dropInput);

    if (!pickupCity || !dropCity) {
        Swal.fire("❌ Unknown City", "Please enter locations within known cities like Chennai, Bangalore, Vellore, Salem, etc.", "error");
        return;
    }

    const [pickupLat, pickupLon] = cityCoordinates[pickupCity];
    const [dropLat, dropLon] = cityCoordinates[dropCity];
    const distance = calculateDistance(pickupLat, pickupLon, dropLat, dropLon);
    const fare = estimateFare(distance);

    document.getElementById('distance').innerText = distance.toFixed(2) + " km";
    document.getElementById('estimated-fare').innerText = "₹" + fare.toFixed(2);

    const ridesRef = ref(database, "rides");
    const newRideRef = push(ridesRef);

    set(newRideRef, {
        pickup: pickupInput,
        drop: dropInput,
        date,
        time,
        payment,
        fare: fare.toFixed(2),
        pickupCity,
        dropCity,
        status: "pending" 
    })
    .then(() => {
        Swal.fire({
            icon: "success",
            title: "Ride Booked!",
            text: `Your ride is confirmed. Estimated Fare: ₹${fare.toFixed(2)}`,
            confirmButtonText: "Go to Map"
        }).then(result => {
            if (result.isConfirmed) {
                window.location.href = "map.html";
            }
        });
    })
    .catch((error) => {
        console.error("Ride booking failed:", error);
        Swal.fire("❌ Error", "Failed to confirm ride. Please try again.", "error");
    });
});
