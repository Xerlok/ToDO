/* eslint-disable object-curly-newline */
/* eslint-disable spaced-comment */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable */
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged } from 'firebase/auth';

// App's Firebase configuration
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

function loadFromStorage() {
  const projectsRef = ref(database, 'projects');

  return new Promise((resolve) => {
    onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      resolve(data); // Resolve the promise with the loaded data
    });
  });
}

function saveToStorage(array) {
  set(ref(database, 'projects'), {
    projects: array,
  });
}

function signUpUser(email, pswrd, dom) {
  createUserWithEmailAndPassword(auth, email, pswrd).then(userCredential => {
    const user = userCredential;
    console.log(user);

    dom.signUpForm.reset();
    dom.authentication.style.display = 'none';
    dom.signUpContainer.style.display = 'none';
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    if (errorCode === 'auth/email-already-in-use') {
      alert('This email is already in use!');
    }
  });
}

function signInUser(email, pswrd, dom) {
  signInWithEmailAndPassword(auth, email, pswrd).then((userCredential) => {
    const user = userCredential;
    console.log(user);

    dom.signInForm.reset();
    dom.authentication.style.display = 'none';
    dom.signInContainer.style.display = 'none';
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
}

function signOutUser(dom) {
  auth.signOut().then(() => {
    dom.mainMenu.classList.remove('open');
    alert('Logged out');
  });
}

export {
  loadFromStorage,
  saveToStorage,
  signUpUser,
  signInUser,
  signOutUser,
  auth,
};
