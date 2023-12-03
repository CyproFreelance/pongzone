import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyANc-4NBGYrWBYoHUPq3Zes06axp_C-JeA",
  authDomain: "ponggame-406712.firebaseapp.com",
  projectId: "ponggame-406712",
  storageBucket: "ponggame-406712.appspot.com",
  messagingSenderId: "166750811137",
  appId: "1:166750811137:web:b34d56d98bb5fc0efd3c00",
  measurementId: "G-1WDFEX4HQ0"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };