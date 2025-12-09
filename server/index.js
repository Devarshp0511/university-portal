const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

// ----- CONNECT TO MONGODB -----
mongoose
  .connect('mongodb://127.0.0.1:27017/uniDB')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ----- SCHEMA -----
const uniSchema = new mongoose.Schema({
  name: String,
  country: String,
  alpha_two_code: String,
  "state-province": String,
  domains: [String],
  web_pages: [String],
});
uniSchema.index({ country: 1 });
uniSchema.index({ "state-province": 1 });

const University = mongoose.model('University', uniSchema);

// ----- GLOBAL INGEST -----
const countries = [
  "Afghanistan", "Argentina", "Australia", "Austria", "Bangladesh", "Belgium", "Brazil",
  "Canada", "Chile", "China", "Colombia", "Czech Republic", "Denmark", "Egypt", "Finland",
  "France", "Germany", "Greece", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia",
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Japan", "Jordan", "Kenya", "Malaysia",
  "Mexico", "Morocco", "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia",
  "Singapore", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland",
  "Taiwan", "Thailand", "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom",
  // ❌ United States temporarily excluded due to API failure
];

app.get('/ingest-all', async (req, res) => {
  res.setTimeout(0);
  console.log("🌍 Starting Global Ingestion WITHOUT USA...");

  try {
    await University.deleteMany({});
    console.log("🗑️ Old database cleared");

    let totalInserted = 0;

    for (const country of countries) {
      console.log(`⏳ Fetching ${country}...`);
      try {
        const url = `http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`;
        const response = await fetch(url);
        const results = await response.json();

        console.log(` 🌐 ${country} returned ${results.length}`);

        if (results.length > 0) {
          await University.insertMany(results);
          totalInserted += results.length;
          console.log(` 💾 Saved ${country}`);
        }
      } catch (err) {
        console.log(` ⚠ Skipped ${country} due to API error: ${err.message}`);
      }
    }

    console.log(`🎉 DONE — Inserted ${totalInserted} universities (USA skipped)`);
    res.send(`Success — Inserted ${totalInserted} universities. (USA excluded due to API error)`);
  } catch (err) {
    console.error("❌ Ingestion Error:", err.message);
    res.status(500).send("Failed: " + err.message);
  }
});

// ----- SEARCH API -----
app.get('/universities', async (req, res) => {
  const { country, province } = req.query;

  let query = {};
  if (country) query.country = country;
  if (province) query["state-province"] = province;

  const results = await University.find(query).limit(200);
  res.json(results);
});

// ----- START SERVER -----
app.listen(5001, () => console.log("🚀 Server running on port 5001"));
