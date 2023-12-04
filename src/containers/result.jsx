import React, { useState, useEffect } from 'react';
import { getUserData, storeUserData } from '../components/firebaseservice';
import { adminData } from '../components/adminData'; 
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';

const images = Array.from({ length: 45 }, (_, index) => require(`../assets/images/${index + 1}.png`));

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
          setTimeRemaining(userData.timerStats?.totalTime || 24 * 60 * 60);
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
      storeUserData(localStorage.getItem('userEmail'), localStorage.getItem('displayName'), winStreak, { totalTime: timeRemaining });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeRemaining, winStreak]);
  
  window.history.pushState(null, null, '/result');

  useEffect(() => {
    const handleNavigation = () => {
      storeUserData(localStorage.getItem('userEmail'), localStorage.getItem('displayName'), winStreak, { totalTime: timeRemaining });
    };
    window.addEventListener('beforeunload', handleNavigation);
    return () => {
      window.removeEventListener('beforeunload', handleNavigation);
    };
  }, [timeRemaining, winStreak]);

  const renderImages = () => {
    const totalImages = 45;
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
        {adminData.includes(localStorage.getItem('userEmail')) && <button id='specialaccess'> <Link to={'/straightouttacampaign-admin-space'}>Admin Panel</Link></button>}
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
