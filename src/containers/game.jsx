import React, { useState, useEffect } from 'react';
import '../App.css';
import { getGameData, getUserData, storeUserData } from '../components/firebaseservice';
import { useNavigate } from 'react-router-dom';

// const rand = "../comoponents/logic/game.html"

export const Game = () => {

  const [gameData, setGameData] = useState([]);
  const [userData, setUserData] = useState({ winStreak: 0 }); // Set an initial value for winStreak
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch game data
        const game = await getGameData();
        if (game && typeof game === 'object') {
          console.log('GameData:', game);
          setGameData(game);
        } else {
          console.log('No game data found or invalid format.');
        }

        // Fetch user data
        const userEmail = localStorage.getItem('userEmail');
        const user = await getUserData(userEmail);
        if (user && typeof user === 'object') {
          console.log('UserData', user);
          // Set the initial win streak value from the database
          setUserData({ ...user, winStreak: user.winStreak || 0 });
        } else {
          console.log('No user data found or invalid format.');
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleWin = async () => {
    setUserData((prevUserData) => ({ ...prevUserData, winStreak: prevUserData.winStreak + 1 }));
    const userEmail = localStorage.getItem('userEmail');
    const displayName = localStorage.getItem('displayName');

    console.log('User Email:', userEmail);
    console.log('User Email:', displayName);

    if (userEmail) {
      await storeUserData(userEmail, displayName, userData.winStreak + 1);
    } else {
      console.error('User email is null. Unable to update user data.');
    }

    const resultMessage = document.getElementById('result');
    resultMessage.textContent = 'You Won';
    resultMessage.style.color = '#ADD8E6';
    resultMessage.style.fontFamily = 'Debussylikefont';
    resultMessage.style.backdropFilter = 'blur(2px)';
    resultMessage.style.fontSize = '65px';
    resultMessage.style.zIndex = '4';

    setTimeout(() => {
      window.history.replaceState(null, null, window.location.href);
      navigate('/result');
      resultMessage.style.zIndex = '0';
    }, 2000);
  };

  let remainingChances = 5; // Set the desired number of chances

  const checkGuess = () => {
    const guessDigits = Array.from(document.querySelectorAll('.guess')).map((input) => input.value).join('').toLowerCase();
    const correctGuess = gameData.keywords;
    const resultMessage = document.getElementById('result');
  
    if (guessDigits === correctGuess) {
      handleWin();
    } else {
      remainingChances--;
  
      if (remainingChances > 0) {
        resultMessage.style.color = '#FFB6C1';
        resultMessage.style.fontFamily = 'Debussylikefont';
        resultMessage.style.textAlign = 'center'
        resultMessage.textContent = `Wrong Guess.`;
        resultMessage.style.backdropFilter = 'blur(2px)';
        resultMessage.style.zIndex = '4';
        resultMessage.style.fontSize = '65px';
  
        setTimeout(() => {
          resultMessage.style.zIndex = '0';
        }, 2000);
      } else {
        resultMessage.style.color = '#FFB6C1';
        resultMessage.style.fontFamily = 'Debussylikefont';
        resultMessage.style.textAlign = 'center'
        resultMessage.textContent = 'Out of chances. The correct answer is ' + correctGuess;
        resultMessage.style.backdropFilter = 'blur(2px)';
        resultMessage.style.zIndex = '4';
        resultMessage.style.fontSize = '65px';
  
        setTimeout(() => {
          resultMessage.style.zIndex = '0';
          navigate('/result')
        }, 2500);
      }
    }
  };
  

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

  

  return (
    <div id="Game">
      <h1 className="head">
        Guess <span>First</span>
      </h1>
      <div id="container">
        <div className="game">
        <iframe title="game" src="https://proto.sarthaktulsidas.repl.co/" width="700" height="600" />
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
