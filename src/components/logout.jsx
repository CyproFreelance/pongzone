import React from 'react';
import '../App.css'
import { GoogleLogout } from 'react-google-login';

const client_id = "166750811137-et1b6hjpveudcbk6n5p3913dpfu7fd7e.apps.googleusercontent.com";

const Logout = () => {
  const onSuccess = () => {
    console.log("Logout successful");
  };

  return (
    <div id="logout">
      <GoogleLogout
        clientId={client_id}
        buttonText="Log Out"
        onSuccess={onSuccess}
      />
    </div>
  );
};

export default Logout;
