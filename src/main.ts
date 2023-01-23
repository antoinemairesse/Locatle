import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/index.css'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnJmvhIRB0Io4xZ91_4PJ0IkH1LB8kvGs",
  authDomain: "locatle-game.firebaseapp.com",
  projectId: "locatle-game",
  storageBucket: "locatle-game.appspot.com",
  messagingSenderId: "525983742809",
  appId: "1:525983742809:web:99e739a7ee7d436d96ea48"
};

initializeApp(firebaseConfig);

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
