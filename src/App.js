import './App.css'
import { useEffect, useState } from 'react'

import {
  addDoc,
  collection,
  query,
  serverTimestamp,
  getFirestore,
  orderBy,
  onSnapshot,
} from 'firebase/firestore'

import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { initializeApp } from 'firebase/app'
import { config } from './firebaseConfig'

import Profile from './components/Profile'
import ChatRoom from './components/ChatRoom'

const app = initializeApp(config)
const db = getFirestore(app)
const auth = getAuth()
const messagesRef = collection(db, 'messages')

function App() {
  const [user] = useAuthState(auth)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    const queryMessages = query(messagesRef, orderBy('createdAt'))

    const unsuscribe = onSnapshot(queryMessages, snapshot => {
      let messages = []
      snapshot.forEach(doc => {
        messages.push({ ...doc.data(), id: doc.id })
      })
      setMessages(messages)
    })

    return () => unsuscribe()
  }, [])

  const sendMessage = async event => {
    event.preventDefault()

    const { photoURL, uid, displayName } = auth.currentUser
    await addDoc(messagesRef, {
      uid,
      photoURL,
      text,
      displayName,
      createdAt: serverTimestamp(),
    }).finally(() => setText(''))
  }

  return (
    <div className='App'>
      <header className='App-header'>
        {user ? (
          <>
            <Profile username={user.displayName} photoURL={user.photoURL} />
            <SignOut />
          </>
        ) : (
          <h1>💬 Converse em tempo real</h1>
        )}
      </header>
      {user ? (
        <>
          {messages.length > 0 && <ChatRoom messages={messages} />}{' '}
          <form onSubmit={sendMessage}>
            <input
              type='text'
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <button type='submit'>Enviar</button>
          </form>
        </>
      ) : (
        <SignIn />
      )}
    </div>
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
