// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getMessaging, onMessage } from "firebase/messaging";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyDSp2BGBcsS282cPTJSxUzFoW2PKWzAZ0A",
    authDomain: "itsds-v1.firebaseapp.com",
    projectId: "itsds-v1",
    storageBucket: "itsds-v1.appspot.com",
    messagingSenderId: "630938496572",
    appId: "1:630938496572:web:3b9c218459ad16aff71d39",
    measurementId: "G-MEQH21ET8B",
    databaseURL:"https://itsds-v1-default-rtdb.asia-southeast1.firebasedatabase.app/"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const messaging = getMessaging(app);

export const database = getDatabase(app);


export const onMessageListener = () => 
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload)
    })
  });


