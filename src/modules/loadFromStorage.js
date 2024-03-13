/* eslint-disable */
import { ref, onValue } from "firebase/database";
import firebase from './firebase';

export default function loadFromStorage() {
  const cloud = firebase();
  const projectsRef = ref(cloud.database, 'projects');

  return new Promise((resolve) => {
    onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      resolve(data); // Resolve the promise with the loaded data
    });
  });
}
