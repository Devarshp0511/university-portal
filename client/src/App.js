import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import './App.css';

function App() {
  const [country, setCountry] = useState('');
  const [province, setProvince] = useState('');
  const [universities, setUniversities] = useState([]);
  const [availableProvinces, setAvailableProvinces] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUniversities = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5001/universities', {
        params: { country, province }
      });
      setUniversities(res.data);

      if (!province) {
        const provinces = [...new Set(res.data.map(u => u['state-province']).filter(p => p))];
        setAvailableProvinces(provinces);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCard = (id) => {
    const node = document.getElementById(id);
    htmlToImage.toJpeg(node).then((dataUrl) => {
      download(dataUrl, 'university-card.jpeg');
    });
  };

  return (
    <div className="page">
      <header className="header">
        <h1>🌍 University Finder Dashboard</h1>
        <p>Search • Filter • Download University Cards</p>
      </header>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Enter Country (e.g. India)"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setProvince('');
          }}
        />
        <select
          onChange={(e) => setProvince(e.target.value)}
          disabled={!country}
          value={province}
        >
          <option value="">Select Province</option>
          {availableProvinces.map((p, index) => (
            <option key={index} value={p}>{p}</option>
          ))}
        </select>
        <button className="search-btn" onClick={searchUniversities}>
          Search
        </button>
      </div>

      {loading && <div className="loader">Searching universities...</div>}

      <div className="grid">
        {universities.map((uni, index) => (
          <div key={index} id={`card-${index}`} className="card">
            <h3>{uni.name}</h3>
            <p className="country-label">
              {uni['state-province'] ? uni['state-province'] + ", " : ""}
              {uni.country}
            </p>
            <a href={uni.web_pages[0]} target="_blank" rel="noreferrer">
              🌐 Visit Website
            </a>

            <button
              className="download-btn"
              onClick={() => downloadCard(`card-${index}`)}
            >
              ⬇ Save as JPEG
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
