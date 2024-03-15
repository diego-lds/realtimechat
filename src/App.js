import './App.css'
import { useEffect } from 'react'

import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'
import { config } from './firebaseConfig'
import { initializeApp } from 'firebase/app'

const app = initializeApp(config)
const db = getFirestore(app)
const auth = getAuth()

function App() {
  const [user] = useAuthState(auth)

  const getMessages = async () => {
    const querySnapshot = await getDocs(collection(db, 'messages'))
    querySnapshot.forEach(doc => {
      console.log(doc.id, ' => ', doc.data())
    })
  }

  useEffect(() => {
    console.clear()
  }, [])

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>💬 Converse em tempo real</h1>
        <SignOut />
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  )
}

function ChatRoom() {
  const messagesRef = collection(db, 'messages')
  const Query = query(messagesRef)
  const [messages] = useCollectionData(Query, { id: 'id' })

  return (
    <ul>
      {messages &&
        messages.map(message => {
          console.log(messages)
          return (
            <li>
              <img alt='alt' src='./logo192.png' width='50px' />
              <div className='message'>
                <p>{message.text}</p>
              </div>
            </li>
          )
        })}
    </ul>
  )
}

function ChatMessage({ uid, text, photoUrl }) {
  return (
    <li>
      <span>{photoUrl}</span>
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
        Sign Out
      </button>
    )
  )
}

export default App
// const listenMessages = async () => {
//   const unsub = onSnapshot(doc(db, 'messages'), doc => {
//     console.log('Current data: ', doc.data())
//   })
// }
