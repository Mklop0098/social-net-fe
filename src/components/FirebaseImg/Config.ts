
import { initializeApp } from "firebase/app" ;   
import {getStorage} from 'firebase/storage'

const firebaseConfig = { 
  apiKey : "AIzaSyA54-eHYukC3vcltjmUXpo9oqmv4oKWAW4" , 
  authDomain : "social-net-297cf.firebaseapp.com" , 
  projectId : "social-net-297cf" , 
  storageBucket : "social-net-297cf.appspot.com" , 
  messagingSenderId : "973720281569" , 
  appId : "1:973720281569:web:c83098652bb4e9e72372a0" 
};

const app = initializeApp ( firebaseConfig );
export const imageDb = getStorage(app)