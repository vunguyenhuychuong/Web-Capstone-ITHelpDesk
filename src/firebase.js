// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";


const firebaseConfig = {
    apiKey: "AIzaSyDSp2BGBcsS282cPTJSxUzFoW2PKWzAZ0A",
    authDomain: "itsds-v1.firebaseapp.com",
    projectId: "itsds-v1",
    storageBucket: "itsds-v1.appspot.com",
    messagingSenderId: "630938496572",
    appId: "1:630938496572:web:3b9c218459ad16aff71d39",
    measurementId: "G-MEQH21ET8B"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const messaging = getMessaging(app);

// messaging.onBackgroundMessage(function(payload) {
//   console.log('Received background message ', payload);
//  // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });


