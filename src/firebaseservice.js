// firebaseservice.js

import { ref, set } from 'firebase/database';
import { database } from './firebase';

// Function to sanitize the email address for use in the database path
const sanitizeEmail = (email) => {
  return email.replace(/[.#$[\]/]/g, '_'); // Replace ".", "#", "$", "[", "]", and "/" with "_"
};

export const storeUserData = (email, displayName) => {
  try {
    const sanitizedEmail = sanitizeEmail(email);
    const userRef = ref(database, `users/${sanitizedEmail}`);
    const userData = {
      email: email,
      displayName: displayName,
      wins: 0,
      winStreak: 0,
    };

    console.log('Storing user data:', userData);

    set(userRef, userData);

    console.log('User data stored successfully:', displayName);
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};
