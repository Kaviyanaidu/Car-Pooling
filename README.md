# 🚗 Car-Pooling Web App

This is a full-stack web application designed to promote sustainable urban mobility through real-time carpooling. The platform connects drivers and passengers, offering dynamic ride-sharing with route optimization, fare estimation, and secure booking features.

## 🛠️ Features

- 🔐 **User Authentication** using Firebase
- 📍 **Real-Time Ride Booking** with pickup/drop inputs
- 💰 **Fare Estimation** for single and shared rides
- 🚘 **Driver Dashboard** to accept/reject bookings
- 🔄 **Live Ride Matching** for route-sharing
- 🗺️ **Interactive Maps** via Leaflet.js & OpenStreetMap

## 🧱 Technologies Used

- **HTML5, CSS3, JavaScript (ES6+)**
- **Firebase** (Authentication + Realtime DB)
- **Leaflet.js + OpenStreetMap** (for navigation)
- **Modular JavaScript** for each app function


## 🔧 How to Run This Project

1. [Download ZIP](https://github.com/Kaviyanaidu/Car-Pooling.git)
2. Replace dummy config file:
   - Rename `config_sample.js` ➝ `firebase.js`
   - Paste your own Firebase project config inside
3. Open`login.html` in browser
4. Explore login → booking → driver features

## 🔐 Security Note

> **Never upload your real Firebase config publicly.**  
This repo uses `.gitignore` to protect sensitive files like `firebase.js` and `.env`.

## 📄 Project Output

👉 [Click here to view/download the output screenshots (PDF)](https://github.com/Kaviyanaidu/Car-Pooling/raw/0be5421f80026af60c4e47a72af7bd51eb0d248e/Carpool_Project_Output.pdf)


## 📁 Project Structure

carpool-web-app/


├── login.html ← User login

├── signup.html ← New user registration

├── ride_booking.html ← Ride booking form

├── available_rides.html ← Show available rides

├── driver.html ← Driver actions

├── dashboard.html ← User dashboard

├── driver_dashboard.html ← Driver booking view

├── firebase.js ← 🔒 Firebase config (ignored)

├── config_sample.js ← 🔓 Dummy Firebase sample

├── script.js ← Booking JS

├── driver.js ← Driver logic

├── ride_booking.js ← Booking actions

├── available_rides.js ← Ride listing logic

├── map.js ← Map rendering

├── style.css ← All styles

└── .gitignore ← Git ignore rules

## 👩‍💻 Developed By

**Kaviya R**  
MSc Computational Statistics and Data Analytics  
[VIT Vellore]  
📫 [LinkedIn Profile](https://www.linkedin.com/in/kaviya-naidu-28646928a)

## 📄 License

This project is open-source for academic use. Commercial use requires permission.

## ⚙️ How It Works

This carpooling app connects drivers and riders using Firebase for real-time updates and Leaflet.js for location mapping.

**Step-by-step flow:**

1. **User Signup/Login**  
   Authenticated via Firebase using email/password.

2. **Booking a Ride**  
   - Riders enter pickup, drop, date, time, and payment mode.  
   - Distance and fare are calculated using Haversine formula.  
   - Ride is stored in Firebase with a status: `pending`.

3. **Matching Rides**  
   - Riders can search for existing rides by pickup/drop.  
   - Matching routes are shown dynamically.

4. **Driver Dashboard**  
   - Driver sees all pending requests.  
   - Can Accept ✅ / Reject ❌ bookings.  
   - If multiple riders match a route, fare is **split** among them.

5. **Live Map Display**  
   - All confirmed rides appear on a Leaflet.js map.  
   - OpenStreetMap is used for rendering roads and calculating directions.

6. **Realtime Sync**  
   - Any updates (confirm/cancel/book) reflect instantly in the Firebase DB and UI.


