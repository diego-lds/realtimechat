import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import './App.css'

initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASURAMENT_ID,
})

const auth = getAuth()

function App() {
  const [user] = useAuthState(auth)
  console.log(user)
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>💬 Converse em tempo real</h1>
        <section>{user ? <ChatRoom /> : <SignIn />}</section>
      </header>
    </div>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then(result => {
        console.log(result)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  return <button onClick={signInWithGoogle}>Entrar com Google</button>
}

function ChatRoom() {
  return <h1>CHAT</h1>
}

export default App
