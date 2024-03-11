import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import './App.css'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = initializeApp({
  apiKey: 'AIzaSyAES0YYLs-K_fxgIPSAzM3jZEuKyvKQ8kY',
  authDomain: 'realtimechat-83158.firebaseapp.com',
  projectId: 'realtimechat-83158',
  storageBucket: 'realtimechat-83158.appspot.com',
  messagingSenderId: '360580154791',
  appId: '1:360580154791:web:258e088cf0919a54a56282',
  measurementId: 'G-SHSD9DZXFB',
})

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

function App() {
  return (
    <div className='App'>
      <header className='App-header'></header>
    </div>
  )
}

export default App
