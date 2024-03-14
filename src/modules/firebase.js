/* eslint-disable import/no-extraneous-dependencies */
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import Firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

export default function firebase() {
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

  function authentication() {
    const authUI = new firebaseui.auth.AuthUI(auth);

    authUI.start('#firebaseui-auth-container', {
      signInOptions: [
        {
          provider: Firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false,
        },
      ],
      // Other config options...
    });

    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult(authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return true;
        },
        uiShown() {
          // The widget is rendered.
          // Hide the loader.
          document.getElementById('loader').style.display = 'none';
        },
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'popup',
      signInSuccessUrl: '<url-to-redirect-to-on-success>',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        Firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      // Terms of service url.
      tosUrl: '<your-tos-url>',
      // Privacy policy url.
      privacyPolicyUrl: '<your-privacy-policy-url>',
    };

    authUI.start('#firebaseui-auth-container', uiConfig);
  }

  return { app, database, authentication };
}
