import { database } from './firebase';
import { ref, set } from 'firebase/database';

export const storeUserData = (userId, email, displayName) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    set(userRef, { email, displayName, wins: 0, winStreak: 0 });
    console.log('User data stored successfully:', userId);
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};
