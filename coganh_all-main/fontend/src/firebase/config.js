import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';


// import dotenv from 'dotenv';
// dotenv.config();

console.log(process.env.REACT_APP_project_id)

const firebaseConfig = {
  "type": "service_account",
  "projectId": process.env.REACT_APP_project_id,
  "private_key_id": process.env.REACT_APP_private_key_id,
  "private_key": process.env.REACT_APP_private_key,
  "client_email": process.env.REACT_APP_client_email,
  "client_id": process.env.REACT_APP_client_id,
  "auth_uri": process.env.REACT_APP_auth_uri,
  "token_uri": process.env.REACT_APP_token_uri,
  "auth_provider_x509_cert_url": process.env.REACT_APP_auth_provider_x509_cert_url,
  "client_x509_cert_url": process.env.REACT_APP_client_x509_cert_url,
  "universe_domain": process.env.REACT_APP_universe_domain,
  'databaseURL': process.env.REACT_APP_databaseURL,
  'storageBucket': process.env.REACT_APP_storageBucket
};


const firebaseApp = firebase.initializeApp(firebaseConfig);
// firebase.analytics();

// const auth = firebase.auth();
const db = firebase.firestore();

// var firestore = firebase.getFirestore()

export { db, firebaseApp };
export default firebase; 