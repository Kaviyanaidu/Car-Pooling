import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { firebaseConfig } from "./config.js";

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}
const database = getDatabase(app);

const rideList = document.getElementById("rideList");

const ridesRef = ref(database, "rides");
onValue(ridesRef, (snapshot) => {
    rideList.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
        const ride = childSnapshot.val();
        const rideKey = childSnapshot.key;

        if (ride.status === "pending") {
            const rideCard = document.createElement("div");
            rideCard.style.border = "1px solid #ccc";
            rideCard.style.margin = "10px";
            rideCard.style.padding = "10px";

            rideCard.innerHTML = `
                <strong>Pickup:</strong> ${ride.pickup} <br>
                <strong>Drop:</strong> ${ride.drop} <br>
                <strong>Date:</strong> ${ride.date} <br>
                <strong>Time:</strong> ${ride.time} <br>
                <strong>Fare:</strong> ₹${ride.fare} <br><br>
                <button class="accept-btn">✅ Accept</button>
                <button class="reject-btn">❌ Reject</button>
            `;

            rideCard.querySelector(".accept-btn").onclick = () => {
                update(ref(database, `rides/${rideKey}`), { status: "accepted" });
            };
            rideCard.querySelector(".reject-btn").onclick = () => {
                update(ref(database, `rides/${rideKey}`), { status: "rejected" });
            };

            rideList.appendChild(rideCard);
        }
    });
});
