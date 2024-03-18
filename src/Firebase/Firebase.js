import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBS2JaWWlbVBS7Ustn_oQfMK8-ZW9r5ok",
  authDomain: "bj3d-56ec0.firebaseapp.com",
  databaseURL: "https://bj3d-56ec0-default-rtdb.firebaseio.com",
  projectId: "bj3d-56ec0",
  storageBucket: "bj3d-56ec0.appspot.com",
  messagingSenderId: "196080386652",
  appId: "1:196080386652:web:30133daee120fef3235c99",
  measurementId: "G-DQ70H0FQFG",
};

export const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();

export default firebase;
