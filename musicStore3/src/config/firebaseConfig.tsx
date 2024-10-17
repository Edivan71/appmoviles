import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";



const firebaseConfig = {
  apiKey: "AIzaSyAH9xN1z9x7cKG1u4mYrmfGVlRP-rGe8WA",
  authDomain: "moviles-cebe6.firebaseapp.com",
  projectId: "moviles-cebe6",
  storageBucket: "moviles-cebe6.appspot.com",
  messagingSenderId: "380775923782",
  appId: "1:380775923782:web:a46eb28d62998394d78a47",
  databaseURL: "https://moviles-cebe6-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

//export const auth = getAuth(firebase);
export const auth = initializeAuth(firebase, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Realtime Database and get a reference to the service
export const dbRealTime = getDatabase(firebase);




