import React, { useState, useEffect } from 'react';
import { getUserData } from '../components/firebaseservice';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const images = Array.from({ length: 48 }, (_, index) => require(`../assets/images/${index + 1}.png`));

const zeroPad = (num) => (num < 10 ? `0${num}` : num);

export const Result = () => {
  const [winStreak, setWinStreak] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60); // 24 hours in seconds
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWinStreak = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        const userData = await getUserData(userEmail);

        if (userData && typeof userData === 'object') {
          setWinStreak(userData.winStreak || 0);
        } else {
          console.log('No user data found or invalid format.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchWinStreak();
  }, []);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0) {
      navigate('/matchmaking');
    }
  }, [timeRemaining, navigate]);

  useEffect(() => {
    const handleNavigation = (event) => {
      event.preventDefault();
      const { history } = event.currentTarget;
      if (history) {
        history.pushState(null, null, window.location.href);
      }
    };

    window.addEventListener('popstate', handleNavigation);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  const renderImages = () => {
    const totalImages = 48;
    const currentWinStreak = winStreak % totalImages;

    return Array.from({ length: currentWinStreak }, (_, index) => (
      <img key={`image-${index + 1}`} width={250} src={images[index]} className='color' alt={`Winstreak ${index + 1}`} />
    ));
  };

  const renderTime = () => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    return (
      <p>
        <span>{zeroPad(hours)}</span>:<span>{zeroPad(minutes)}</span>:<span>{zeroPad(seconds)}</span>
      </p>
    );
  };

  return (
    <div id='resultcontent'>
      <h1>Wacha<span>machalitt</span></h1>
      <div id="timer">{renderTime()}</div>
      <div className="win-streak-images">{renderImages()} <h4> ✘ {winStreak}</h4></div>
    </div>
  );
};
