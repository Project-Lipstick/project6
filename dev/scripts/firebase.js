import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAwexiXibtCy-1vAH6V_LF2mkrrLlgDQQo",
    authDomain: "makeup-fun.firebaseapp.com",
    databaseURL: "https://makeup-fun.firebaseio.com",
    projectId: "makeup-fun",
    storageBucket: "makeup-fun.appspot.com",
    messagingSenderId: "1012365554610"
};
firebase.initializeApp(config); 

export default firebase;