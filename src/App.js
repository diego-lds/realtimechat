import './App.css'
import { useState } from 'react'

import {
  addDoc,
  collection,
  serverTimestamp,
  getFirestore,
} from 'firebase/firestore'

import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { initializeApp } from 'firebase/app'
import { config } from './firebaseConfig'

import Profile from './components/Profile'
import ChatRoom from './components/ChatRoom'
import useMessages from './hooks/useMessages'

const app = initializeApp(config)
const db = getFirestore(app)
const messagesRef = collection(db, 'messages')
const auth = getAuth()

 

function App() {
    const [user] = useAuthState(auth);
    const [text, setText] = useState('');
    const { messages } = useMessages(messagesRef);

    const sendMessage = async event => {
        event.preventDefault();
        const { uid, photoURL, displayName } = user;
        let message = {
            uid,
            photoURL,
            text,
            displayName,
            createdAt: serverTimestamp(),
        };

        await addDoc(messagesRef, message);
    };

    return user ? (
        <main className='App'>
            <header className='App-header'>
                {user && (
                    <Profile
                        username={user?.displayName}
                        photoURL={user?.photoURL}
                    />
                )}
                <SignOut />
            </header>

            <section>
                <ChatRoom messages={messages} />
                <form className='form' onSubmit={sendMessage}>
                    <input
                        type='text'
                        value={text}
                        onChange={e => setText(e.target.value)}
                    />
                    <button type='submit'>Enviar</button>
                </form>
            </section>
        </main>
    ) : (
        !user && <SignIn />
    );
}

function SignIn() {
  const signInWithGoogle = () => {
    signInWithPopup(auth, new GoogleAuthProvider())
      .then(result => console.log(result))
      .catch(error => console.error({ error }))
  }

  return <button onClick={signInWithGoogle}>Entrar com Google</button>
}

function SignOut() {
  if (!auth) return
  return (
    auth.currentUser && (
      <button className='sign-out' onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  )
}



export default App
