import './App.css';
import { useEffect, useState } from 'react';

import {
    addDoc,
    collection,
    serverTimestamp,
    getFirestore,
    query,
    orderBy,
    onSnapshot,
} from 'firebase/firestore';

import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { initializeApp } from 'firebase/app';
import { config } from './firebaseConfig';

import ChatRoom from './components/ChatRoom';

const app = initializeApp(config);
const db = getFirestore(app);
const auth = getAuth();

function App() {
    const [user] = useAuthState(auth);
    const [text, setText] = useState('');
    const [messages, setMessages] = useState('');
    const messagesRef = collection(db, 'messages');

    useEffect(() => {
        const queryMessages = query(messagesRef, orderBy('createdAt'));

        const unsuscribe = onSnapshot(queryMessages, snapshot => {
            let messages = [];
            snapshot.forEach(doc => {
                messages.push({ ...doc.data(), id: doc.id });
            });
            setMessages(messages);
        });

        return () => unsuscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

        await addDoc(messagesRef, message).finally(setText(''));
    };

    return (
        <main className='App'>
            {!auth.currentUser ? (
                <SignIn />
            ) : (
                <section>
                    <header className='App-header'>
                        <h1>Realtime Chat</h1>
                        <div className='profile'>
                            <h4>{user?.displayName}</h4>
                            <img alt='User' src={user?.photoURL} />
                            <SignOut />
                        </div>
                    </header>
                    <span>chatroom</span>
                </section>
            )}

            <ChatRoom messages={messages} />
            <form className='form' onSubmit={sendMessage}>
                <input
                    type='text'
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
                <button type='submit'>Enviar</button>
            </form>
        </main>
    );
}

function SignIn() {
    const signInWithGoogle = () => {
        signInWithPopup(auth, new GoogleAuthProvider())
            .then(result => console.log(result))
            .catch(error => console.error({ error }));
    };

    return <button onClick={signInWithGoogle}>Entrar com Google</button>;
}

function SignOut() {
    return (
        <button className='button' onClick={() => auth.signOut()}>
            Sair
        </button>
    );
}

export default App;
