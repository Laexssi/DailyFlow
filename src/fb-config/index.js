import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyDLDP1zOtE7DqsxpMFsNtAoNiWAtQlXQ6s',
  authDomain: 'flowdaily.firebaseapp.com',
  projectId: 'flowdaily',
  storageBucket: 'flowdaily.appspot.com',
  messagingSenderId: '347892201213',
  appId: '1:347892201213:web:84df8ff53871f33d30b094',
};

firebase.initializeApp(config);

const firestore = firebase.firestore();
const auth = firebase.auth();

export {
  firestore,
  auth,
  config,
  firebase,
};
