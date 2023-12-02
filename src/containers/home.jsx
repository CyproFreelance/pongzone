import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { storeUserData } from '../firebaseservice';
import '../App.css'
import logo from '../assets/logo.png';

const client_id = "166750811137-et1b6hjpveudcbk6n5p3913dpfu7fd7e.apps.googleusercontent.com";

export const Home = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    console.log('Google Sign-In Response:', response);

    if (response.error === 'idpiframe_initialization_failed') {
      console.error('Google Sign-In initialization failed:', response.details);
    } else if (response.error === 'popup_closed_by_user') {
      console.warn('User closed the Google Sign-In popup.');
    } else if (response.error) {
      console.error('Google Sign-In error:', response.error);
    } else {
      const { profileObj } = response;
      const userId = profileObj?.googleId;

      if (userId) {
        storeUserData(userId, profileObj.email, profileObj.displayName);
        setIsSignedIn(true);
        navigate('/matchmaking');
      } else {
        console.error('Google response did not contain expected data.');
      }
    }
  };

  const handleLogout = () => {
    setIsSignedIn(false);
    localStorage.removeItem('userId');
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    console.log('User ID from local storage:', userId);

    if (userId) {
      setIsSignedIn(true);
      navigate('/matchmaking');
    }
  }, [navigate]);

  return (
    <div id="homecontainer">
      <img src={logo} alt="Logo" className="image" />
      {isSignedIn ? (
        <GoogleLogout
          clientId={client_id}
          buttonText="Sign Out"
          onLogoutSuccess={handleLogout}
        />
      ) : (
        <GoogleLogin
          clientId={client_id}
          buttonText="Sign In By Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
      )}
    </div>
  );
};
