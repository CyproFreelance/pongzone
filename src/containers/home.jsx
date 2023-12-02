import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import logo from '../assets/logo.png';

const client_id = "166750811137-et1b6hjpveudcbk6n5p3913dpfu7fd7e.apps.googleusercontent.com";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div id="homecontainer">
      <img src={logo} alt="Logo" className="image" />
      <GoogleOAuthProvider clientId={client_id}>
        <GoogleLogin
          onSuccess={credentialResponse => {
            var decoded = jwtDecode(credentialResponse.credential);
            console.log(decoded);
            navigate('/matchmaking');
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </GoogleOAuthProvider>
    </div>
  );
};
