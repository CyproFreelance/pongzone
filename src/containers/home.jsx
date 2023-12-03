// eslint-disable-next-line
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import logo from '../assets/logo.png';
import { storeUserData } from '../components/firebaseservice';

const client_id = '166750811137-et1b6hjpveudcbk6n5p3913dpfu7fd7e.apps.googleusercontent.com';

export const Home = () => {
  const navigate = useNavigate();

  const responseGoogle = (decoded) => {
    const { profileObj } = decoded;

    if (profileObj) {
      const email = profileObj.email;
      const displayName = profileObj.name;

      localStorage.setItem('userEmail', email);
      localStorage.setItem('displayName', displayName);
      storeUserData(email, displayName);
      navigate('/matchmaking');
    } else {
      const email = decoded.email;
      const displayName = decoded.name;

      localStorage.setItem('userEmail', email);
      localStorage.setItem('displayName', displayName);
      storeUserData(email, displayName);
      navigate('/matchmaking');
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
