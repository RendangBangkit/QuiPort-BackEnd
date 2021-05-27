const admin = require('firebase-admin');
const serviceAccount = require('./permission.json');

const firebaseConfig = {
  apiKey: 'AIzaSyAHct18Oc06NvE-lS7RNtxt3z8-te4hZcs',
  authDomain: 'quiport.firebaseapp.com',
  databaseURL: 'https://quiport-default-rtdb.firebaseio.com',
  projectId: 'quiport',
  storageBucket: 'quiport.appspot.com',
  messagingSenderId: '769268373725',
  appId: '1:769268373725:web:7d9c0c90c6817ad42b6334',
  measurementId: 'G-1H8KRNL05P',
};

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  ...firebaseConfig,
});

module.exports = firebase;
