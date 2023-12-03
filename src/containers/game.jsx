// Game.js

import React, { useState, useEffect } from 'react';
import '../App.css';
import { getGameData } from '../components/firebaseservice';
import { useNavigate } from 'react-router-dom';

export const Game = () => {
  const [gameData, setGameData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGameData();
        if (data && typeof data === 'object') {
          console.log('GameData:', data);
          setGameData([data]); // Wrap the data in an array
        } else {
          console.log('No game data found or invalid format.');
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    fetchData();
  }, []);

  function moveToNext(input, nextInputId) {
    const maxLength = parseInt(input.getAttribute('maxlength'));
    const clength = input.value.length;

    if (clength >= maxLength) {
      const nextInput = document.getElementById(nextInputId);
      if (nextInput) {
        nextInput.focus();
      }
    } else if (clength === 0) {
      const previousInput = input.previousElementSibling;
      if (previousInput) {
        previousInput.focus();
      }
    }
  }

  function moveToBack(input, event) {
    if (event.key === 'Backspace' && input.value.length === 0) {
      const previousInput = input.previousElementSibling;
      if (previousInput) {
        event.preventDefault();
        previousInput.focus();
      }
    }
  }

  async function checkGuess() {
    const guessDigits = Array.from(document.querySelectorAll('.guess')).map((input) => input.value).join('').toLowerCase();
    const correctGuess = gameData.length > 0 ? gameData[0].keywords : '';
    const resultMessage = document.getElementById('result');
    if (guessDigits === correctGuess) {
      resultMessage.textContent = 'You Won';
      resultMessage.textContent
      resultMessage.style.color = '#ADD8E6';
      resultMessage.style.fontFamily = 'Debussylikefont';
      resultMessage.style.fontSize = '50px';
    } else {
      resultMessage.textContent = 'You Lose';
      resultMessage.style.color = '#FFB6C1';
      resultMessage.style.fontFamily = 'Debussylikefont';
      resultMessage.style.fontSize = '50px';
    }
    navigate('/result');
  }

  return (
    <div id="Game">
      <h1 className="head">
        Guess <span>First</span>
      </h1>
      <div id="container">
        <div className="game">
          {gameData.length > 0 && <img key={gameData[0].photo} src={gameData[0].photo} id="bg" alt="" />}
        </div>
        <div className="guess">
          <input type="text" className="guess" maxLength={1} onInput={(e) => moveToNext(e.target, 'guess2')} />
          <input type="text" className="guess" onKeyDown={(e) => moveToBack(e.target, e)} maxLength={1} id="guess2" onInput={(e) => moveToNext(e.target, 'guess3')} />
          <input type="text" className="guess" onKeyDown={(e) => moveToBack(e.target, e)} maxLength={1} id="guess3" onInput={(e) => moveToNext(e.target, 'guess4')} />
          <input type="text" className="guess" onKeyDown={(e) => moveToBack(e.target, e)} maxLength={1} id="guess4" onInput={checkGuess} />
        </div>
        <div id="result"></div>
      </div>
    </div>
  );
};
