// firebaseservice.js

import { ref, set , get } from 'firebase/database';
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

export const getGameData = async () => {
  try {
    const snapshot = await get(ref(database, 'data'));
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error getting game data:', error);
    throw error;
  }
};

export const updateGameData = async (imageUrl, keywords) => {
  try {
    const newData = {
      photo: imageUrl,
      keywords: keywords.toLowerCase().substring(0, 4),
    };

    await set(ref(database, 'data'), newData);
    console.log('Game data updated successfully:', newData);
  } catch (error) {
    console.error('Error updating game data:', error);
    throw error;
  }
};
