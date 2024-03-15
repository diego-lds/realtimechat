import './App.css'
import { useEffect } from 'react'

import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { collection, query } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'
import { config } from './firebaseConfig'
import { initializeApp } from 'firebase/app'

const app = initializeApp(config)
const db = getFirestore(app)
const auth = getAuth()

function App() {
  const [user] = useAuthState(auth)
  return (
    <div className='App'>
      <header className='App-header'>
        {user ? (
          <>
            <Profile photo={user.photoURL} name={user.displayName} />
            <SignOut />
          </>
        ) : (
          <h1>💬 Converse em tempo real</h1>
        )}
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  )
}

function Profile({ photo, name }) {
  return (
    <div className='profile'>
      <img alt={name} src={photo} />
      <h6>{name}</h6>
    </div>
  )
}

function ChatRoom() {
  const messagesRef = collection(db, 'messages')
  const Query = query(messagesRef)
  const [messages] = useCollectionData(Query, { id: 'id' })

  if (!messages) return <p>Sem mensagems</p>
  return (
    <ul>
      {messages &&
        messages.map(message => {
          return <ChatMessage {...message} />
        })}
    </ul>
  )
}

function ChatMessage({ text, photoUrl }, user) {
  return (
    <li className='message-box'>
      <img alt='alt' src={photoUrl} width='50px' />
      <div className='message-content'>
        <p>{text}</p>
      </div>
    </li>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
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

function SignOut() {
  return (
    auth.currentUser && (
      <button className='sign-out' onClick={() => auth.signOut()}>
        Deslogar
      </button>
    )
  )
}

export default App
