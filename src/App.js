import './App.css'
import {  useState } from 'react'

import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { initializeApp } from 'firebase/app'

import {
  addDoc,
  collection,
  query,
  serverTimestamp, getFirestore
} from 'firebase/firestore'

import { config } from './firebaseConfig'

const app = initializeApp(config)
const db = getFirestore(app)
const auth = getAuth()

function App() {
  let [user] = useAuthState(auth)

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
      {user ? (
        <>
          <ChatRoom />
        </>
      ) : (
        <SignIn />
      )}
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
  console.log(messages)
  const [text, setText] = useState('')

  const sendMessage = async event => {
    event.preventDefault()

    const { photoURL, uid } = auth.currentUser

    await addDoc(messagesRef, {
      uid,
      photoURL,
      text,
      createdAt: serverTimestamp(),
    }).finally(() => setText(''))
  }

  return (
    <>
      <ul>
        {messages &&
          messages.map((message, index) => {
            return <ChatMessage key={index} {...message}  />
          })}
      </ul>
      <form onSubmit={sendMessage}>
        <input
        type='text' placeholder='Digite sua mensagem...' value={text}
        onChange={e => setText(e.target.value)}
        />
        <button type='submit'>Enviar</button>
      </form>
    </>
  )
}

function ChatMessage({ text, photoURL, uid, createdAt }) {
  
  return (
    <li >
      <div  className='message-box'>
        <img alt='alt' src={photoURL} width='50px' height='50px' />
        <div className='message-content'>
          <span>{auth.currentUser.displayName}</span>
          <p>{text}</p>
        </div>
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
