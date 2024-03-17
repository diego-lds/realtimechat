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

import Profile from './components/Profile';
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
            .catch(error => console.error({ error }));
    };

    return <button onClick={signInWithGoogle}>Entrar com Google</button>;
}

function SignOut() {
    return (
        <button className='sign-out' onClick={() => auth.signOut()}>
            Deslogar
        </button>
    );
}

export default App;
