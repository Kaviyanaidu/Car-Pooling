import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { firebaseConfig } from "./config.js";

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}
const db = getDatabase(app);

const ridesRef = ref(db, "rides");

function groupRides(data) {
    const groups = {};

    Object.entries(data).forEach(([id, ride]) => {
        const key = `${ride.pickup}_${ride.drop}_${ride.date}_${ride.time}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push({ id, ...ride });
    });

    return groups;
}

onValue(ridesRef, (snapshot) => {
    const data = snapshot.val();
    const container = document.getElementById("rides-container");
    container.innerHTML = "";

    if (!data) {
        container.innerHTML = "<p>No rides booked yet.</p>";
        return;
    }

    const grouped = groupRides(data);

    Object.entries(grouped).forEach(([key, rides]) => {
        const ride = rides[0]; // Reference from first ride
        const farePerPerson = (parseFloat(ride.fare) / rides.length).toFixed(2);

        const rideCard = document.createElement("div");
        rideCard.className = "ride-card";
        rideCard.innerHTML = `
            <h3>Ride from ${ride.pickup} to ${ride.drop}</h3>
            <p><strong>Date:</strong> ${ride.date} | <strong>Time:</strong> ${ride.time}</p>
            <p><strong>Passengers:</strong> ${rides.length}</p>
            <p><strong>Fare per person:</strong> ₹${farePerPerson}</p>
            <button>Confirm Ride</button>
            <hr>
        `;

        rideCard.querySelector("button").addEventListener("click", () => {
            rides.forEach((r) => {
                const rideRef = ref(db, `rides/${r.id}`);
                update(rideRef, { status: "confirmed", farePerPerson });
            });

            Swal.fire("✅ Ride Confirmed", `All ${rides.length} passengers have been confirmed.`, "success");
        });

        container.appendChild(rideCard);
    });
});
