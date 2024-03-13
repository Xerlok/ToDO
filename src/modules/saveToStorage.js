/* eslint-disable */
import { ref, set } from "firebase/database";
import firebase from './firebase';

export default function saveToStorage(array) {
  const cloud = firebase();

  set(ref(cloud.database, 'projects'), {
    projects: array,
  });
}
