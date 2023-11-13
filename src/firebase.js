// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyDHfIOD6SJ2PiBwWBm91xsWXhPIr8uOFo4",
//     authDomain: "store-image-24550.firebaseapp.com",
//     projectId: "store-image-24550",
//     storageBucket: "store-image-24550.appspot.com",
//     messagingSenderId: "577145137585",
//     appId: "1:577145137585:web:9be114b6684bf5b6877590",
//     measurementId: "G-QJGWZ52BE9"
// };

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