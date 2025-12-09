🌍 University Finder Dashboard

A modern full-stack MERN web application that allows users to search, filter, and download university information from multiple countries.
The system includes a Node.js/Express ingestion API, a MongoDB database, and a React dashboard UI.

🚀 Features
✅ Level 1 — Database Ingestion

Fetches university data for 60+ countries

Stores them in MongoDB (uniDB → universities)

Prevents duplicates

Skips unstable API countries (e.g., USA throttle issues)

✅ Level 2 — Basic Search

Search universities simply by entering a country name

✅ Level 3 — Province Filtering

Automatically loads unique provinces/state list after selecting a country

Allows users to refine search using dropdown

✅ Level 4 — Download University Card

Converts dynamic university card into JPEG image

User can download each card separately

🎨 UI Features

Modern dashboard layout

Smooth hover effects

Gradient header

Responsive card grid

Green “Download JPEG” UI button

Search toolbar with professional styling

🖥️ Tech Stack
Layer	Technology
Frontend	React, HTML-to-Image, Axios
Backend	Node.js, Express.js
Database	MongoDB (Compass)
Styling	Custom CSS dashboard theme


university-portal/
 ├── client/          → React frontend
 │   ├── src/
 │   │   ├── App.js
 │   │   ├── App.css
 │   │   └── ...
 ├── server/          → Node.js ingestion & search APIs
 │   ├── index.js
 │   └── package.json
 ├── README.md


🔧 Backend API Endpoints
🔹 Ingest All Countries
GET /ingest-all

Fetches & stores thousands of universities into MongoDB.

🔹 Search Universities

Search by country:

GET /universities?country=India


Search by country + province:

GET /universities?country=India&province=Delhi

▶️ Running the Project Locally
1️⃣ Start Backend
cd server
npm install
node index.js


Backend runs at:

http://localhost:5001

2️⃣ Start Frontend
cd client
npm install
npm start

Frontend runs at:

http://localhost:3000
