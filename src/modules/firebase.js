/* eslint-disable object-curly-newline */
/* eslint-disable spaced-comment */
/* eslint-disable import/no-extraneous-dependencies */
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

function firebase() {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyCehF-hGY4RGjJLroyDSa8e5HrkUYyDaHo',
    authDomain: 'todo-31b45.firebaseapp.com',
    projectId: 'todo-31b45',
    storageBucket: 'todo-31b45.appspot.com',
    messagingSenderId: '869978818357',
    appId: '1:869978818357:web:61e69e97610662c8a76e7c',
    databaseURL: 'https://todo-31b45-default-rtdb.europe-west1.firebasedatabase.app/',
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth(app);

  return { app, database, auth };
}

function loadFromStorage() {
  const cloud = firebase();
  const projectsRef = ref(cloud.database, 'projects');

  return new Promise((resolve) => {
    onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      resolve(data); // Resolve the promise with the loaded data
    });
  });
}

function saveToStorage(array) {
  const cloud = firebase();

  set(ref(cloud.database, 'projects'), {
    projects: array,
  });
}

export { firebase, loadFromStorage, saveToStorage };
