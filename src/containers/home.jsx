// eslint-disable-next-line
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import logo from '../assets/logo.png';
import { storeUserData, getUserData } from '../components/firebaseservice';

const client_id = '166750811137-et1b6hjpveudcbk6n5p3913dpfu7fd7e.apps.googleusercontent.com';

export const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSignIn = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        const user = await getUserData(userEmail);
        if (user && typeof user === 'object') {
          navigate('/matchmaking');
        }
      }
    };
    checkUserSignIn();
  }, [navigate]);

  const responseGoogle = async (decoded) => {
    console.log('Decoded:', decoded);

    const email = decoded.email || decoded.profileObj?.email;
    const displayName = decoded.name || decoded.profileObj?.name;

    if (email && displayName) {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('displayName', displayName);
      const user = await getUserData(email);
      const winStreak = user && typeof user === 'object' ? user.winStreak || 0 : 0;
      storeUserData(email, displayName, winStreak);
      setTimeout(() => {
        navigate('/matchmaking');
      }, 4000);
    } else {
      console.error('Invalid decoded token structure:', decoded);
    }
  };

  return (
    <div id="homecontainer">
      <img src={logo} alt="Logo" className="image" />
      <GoogleOAuthProvider clientId={client_id}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const decoded = jwtDecode(credentialResponse.credential);
            console.log(decoded);
            responseGoogle(decoded);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </GoogleOAuthProvider>
    </div>
  );
};
