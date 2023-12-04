// firebaseservice.js

import { ref, set, get } from 'firebase/database';
import { database } from './firebase';

const sanitizeEmail = (email) => {
  return email.replace(/[.*+#/[\]/]/, '_');
};

export const storeUserData = async (email, displayName, winStreak) => {
  try {
    const sanitizedEmail = sanitizeEmail(email);
    const userRef = ref(database, `users/${sanitizedEmail}`);

    const sanitizedWinStreak = typeof winStreak === 'number' && !isNaN(winStreak) ? winStreak : 0;

    const userData = {
      email: email,
      displayName: displayName,
      winStreak: sanitizedWinStreak,
    };

    console.log('Storing user data:', userData);

    await set(userRef, userData, { merge: true });

    console.log('User data stored successfully:', displayName);
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};
export const getUserData = async (email) => {
  try {
    const sanitizedEmail = sanitizeEmail(email);
    const userRef = ref(database, `users/${sanitizedEmail}`);
    const snapshot = await get(userRef);

    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
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
