// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Initialize Leaflet Map (Default Center: VIT Vellore)
var map = L.map('map').setView([12.9716, 79.1594], 13);

// Load OpenStreetMap Tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Store Markers & Routes for Cleanup
let rideMarkers = [];
let routeLines = [];

// Fetch Rides from Firebase
const ridesRef = ref(database, "rides");

onValue(ridesRef, async (snapshot) => {
    clearMap(); // Remove old markers before adding new ones

    if (!snapshot.exists()) {
        console.log("🚫 No rides available.");
        return;
    }

    snapshot.forEach(async (childSnapshot) => {
        let ride = childSnapshot.val();
        let rideId = childSnapshot.key;

        let pickupCoords = await getCoordinates(ride.pickup);
        let dropCoords = await getCoordinates(ride.drop);

        if (pickupCoords && dropCoords) {
            addRideToMap(rideId, ride, pickupCoords, dropCoords);
        }
    });
});

// Function to Add Ride Markers & Route
async function addRideToMap(rideId, ride, pickupCoords, dropCoords) {
    // Add Pickup Marker
    let pickupMarker = L.marker(pickupCoords)
        .addTo(map)
        .bindPopup(`
            <b>Pickup:</b> ${ride.pickup}<br>
            <b>Drop:</b> ${ride.drop}<br>
            <b>Date:</b> ${ride.date}<br>
            <b>Time:</b> ${ride.time}<br>
            <b>Fare:</b> ₹${ride.fare}<br>
            <b>Payment:</b> ${ride.payment}<br>
            <button onclick="cancelRide('${rideId}')">🚫 Cancel Ride</button>
        `);
    rideMarkers.push(pickupMarker);

    // Add Drop Marker
    let dropMarker = L.marker(dropCoords)
        .addTo(map)
        .bindPopup(`<b>Drop Location:</b> ${ride.drop}`);
    rideMarkers.push(dropMarker);

    // Draw Route
    drawRoute(pickupCoords, dropCoords);
}

// Function to Convert Address to Coordinates Using OpenStreetMap Nominatim API
async function getCoordinates(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
        let response = await fetch(url);
        let data = await response.json();

        if (data.length > 0) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        } else {
            console.warn("⚠️ Location not found:", address);
            return null;
        }
    } catch (error) {
        console.error("❌ Geocoding error:", error);
        return null;
    }
}

// Function to Draw Route Between Two Points
async function drawRoute(startCoords, endCoords) {
    if (!startCoords || !endCoords) return;

    let routeUrl = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`;

    try {
        let response = await fetch(routeUrl);
        let data = await response.json();

        if (!data.routes || data.routes.length === 0) {
            console.error("No route found!");
            return;
        }

        let routeCoords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        let routeLine = L.polyline(routeCoords, { color: 'blue', weight: 5 }).addTo(map);
        routeLines.push(routeLine);

    } catch (error) {
        console.error("🚧 Route API Error:", error);
    }
}

// Function to Cancel a Ride
window.cancelRide = function(rideId) {
    if (!rideId) {
        alert("⚠️ No ride selected to cancel!");
        return;
    }

    const rideRef = ref(database, `rides/${rideId}`);

    remove(rideRef)
        .then(() => {
            alert("🚫 Ride Cancelled Successfully!");
            clearMap();
        })
        .catch((error) => {
            console.error("❌ Error cancelling ride:", error);
        });
};

// Function to Clear Map (Remove Markers & Routes)
function clearMap() {
    rideMarkers.forEach(marker => map.removeLayer(marker));
    routeLines.forEach(route => map.removeLayer(route));

    rideMarkers = [];
    routeLines = [];
}
