// Admin.jsx

import React, { useState } from 'react';
import { updateGameData, } from './firebaseservice';
import '../App.css';
import { useNavigate } from 'react-router';

export const Admin = () => {

  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState('');
  const [keywords, setKeywords] = useState('');

  const handleSubmit = async () => {
    if (!imageUrl || !keywords) {
      alert('Please provide both image URL and keywords.');
      return;
    }

    await updateGameData(imageUrl, keywords);

    setImageUrl('');
    setKeywords('');

    console.log('Game data updated successfully:', { photo: imageUrl, keywords: keywords });
  };

  function goToHome() {
    navigate('/')
  }

  return (
    <div id="form">
      <h1 onClick={goToHome}>
        Straight Outta Cromption <br /> <span>Admin Space</span>
      </h1>
      <div className="box">
        <h2>Paste the Url Below</h2>
        <div className="sa">
          <input
            type="text"
            name="imageUrl"
            placeholder="Image Url Here"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            autoComplete="off"
          />

          <div className="flexbox">
            <input
              type="text"
              name="keyWords"
              placeholder="Guessing word"
              maxLength={4}
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              autoComplete="off"
            />
            <button type="button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
