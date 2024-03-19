import './App.css';
import { useEffect, useRef, useState } from 'react';

import {
    addDoc,
    collection,
    serverTimestamp,
    getFirestore,
    query,
    orderBy,
    onSnapshot,
    limit,
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
    const dummy = useRef();

    useEffect(() => {
        const queryMessages = query(messagesRef, orderBy('createdAt'));

        const unsuscribe = onSnapshot(queryMessages, snapshot => {
            let messages = [];
            snapshot.forEach(doc => {
                const userIdMatch = doc.data().uid === user?.uid;
                messages.push({
                    ...doc.data(),
                    id: doc.id,
                    key: doc.id,
                    userIdMatch,
                });
            });
            setMessages(messages);
        });

        return () => unsuscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

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
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <main className='App'>
            {!auth.currentUser ? (
                <SignIn />
            ) : (
                <section>
                    <header className='App-header'>
                        <h1 className='title'>Realtime Chat</h1>
                        <div className='profile'>
                            <h4>{user?.displayName}</h4>
                            <img alt='User' src={user?.photoURL} width={50} />
                            <SignOut />
                        </div>
                    </header>
                    <section className='wrapper'>
                        <ChatRoom
                            messages={messages}
                            reference={dummy}
                            userId={user?.currentUser?.uid}
                        />
                    </section>
                    <form className='form' onSubmit={sendMessage}>
                        <input
                            type='text'
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder='Digite uma mensagem'
                        />
                    </form>
                </section>
            )}
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
