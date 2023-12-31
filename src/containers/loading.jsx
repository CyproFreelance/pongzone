import React from 'react';
import './special.css';
import videoo from '../assets/load.mp4';
import { useNavigate } from 'react-router-dom';
// import { useEffect } from 'react'
// import { getUserData } from '../components/firebaseservice';

export const Load = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const checkTimerStatsAndNavigate = async () => {
  //     try {
  //       const userEmail = localStorage.getItem('userEmail');
  //       const userData = await getUserData(userEmail);
  //       if (userData && userData.timerStats === 0) {
  //         setTimeout(() => {
  //           console.log("time protection is closed due to testing changes")
  //           // navigate('/gameroom');
  //         }, 8000);
  //       } else {
  //         console.log("time protection is closed due to testing changes")
  //         // navigate('/result');
  //       }
  //     } catch (error) {
  //       console.error('Error checking timerStats:', error);
  //     }
  //   };

  //   checkTimerStatsAndNavigate();
  // }, [navigate]);

  setTimeout(() => {
    navigate('/gameroom');
  }, 5000);

  return (
    <div id="matchmaking">
      <h1>Wacha<span>macalitt</span></h1>
      <video src={videoo} autoPlay loop muted></video>
      <h1>Waiting for the Opponent...</h1>
    </div>
  );
};


// Note: Only for Production time protection was removed if you want to enable that then remove the (line 32-34) and uncomment the {line (10-30) and (line 2) using ctrl+/} and git that all set