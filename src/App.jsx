import { useEffect, useRef, useState } from 'react';

import {
    addDoc,
    collection,
    serverTimestamp,
    getFirestore,
    query,
    orderBy,
    limit,
    onSnapshot,
} from 'firebase/firestore';

import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { initializeApp } from 'firebase/app';
import { config } from './firebaseConfig';

import ChatRoom from './components/ChatRoom';
import UserProfile from './components/UserProfile';
import Input from './components/Input';

const app = initializeApp(config);
const db = getFirestore(app);
const auth = getAuth();

function App() {
    const [user] = useAuthState(auth);
    const [text, setText] = useState('');
    const [messages, setMessages] = useState();
    const messagesRef = collection(db, 'messages');
    const dummy = useRef();

    useEffect(() => {
        const queryMessages = query(
            messagesRef,
            orderBy('createdAt', 'desc'),
            limit(50)
        );
        const unsuscribe = onSnapshot(queryMessages, snapshot => {
            let messages = [];
            try {
                snapshot.forEach(doc => {
                    const data = doc.data();
                    console.log(data);
                    messages.push({
                        ...data,
                        userIdMatch: data.uid === user?.uid,
                    });
                });
                setMessages(messages);
                // message sent ? screen should move up
                dummy.current.scrollIntoView({ behavior: 'smooth' });
            } catch (e) {
                console.log(e);
            }
        });
        return () => unsuscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sendMessage = async event => {
        event.preventDefault();
        const { uid, photoURL, displayName } = user;

        await addDoc(messagesRef, {
            uid,
            photoURL,
            text,
            displayName,
            createdAt: serverTimestamp(),
        });
        setText('');
    };

    if (!auth.currentUser) {
        return messages && <SignIn />;
    }

    return (
        <>
            <header className='flex justify-between items-center bg-gray-700 text-white sticky top-0 z-10'>
                <h1 className=' text-3xl font-bold '>Realtime Chat</h1>
                <UserProfile user={user} />
                <SignOut />
            </header>
            <section>
                <span ref={dummy} />
                <ChatRoom messages={messages} userId={user?.currentUser?.uid} />
            </section>

            <footer className='fixed bottom-0 w-full'>
                <form onSubmit={sendMessage}>
                    <Input text={text} setText={setMessages} />
                </form>
            </footer>
        </>
    );
}

function SignIn() {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, new GoogleAuthProvider())
            .then(result => console.log(result))
            .catch(error => console.error({ error }));
    };

    return (
        <>
            <button
                type='button'
                onClick={signInWithGoogle}
                className='text-white ml-[45vw] mt-[45vh]  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2'
            >
                <svg
                    className='w-4 h-4 me-2'
                    aria-hidden='true'
                    fill='currentColor'
                    viewBox='0 0 18 19'
                >
                    <path
                        fillRule='evenodd'
                        d='M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z'
                        clipRule='evenodd'
                    />
                </svg>
                Entrar com Google
            </button>
        </>
    );
}

function SignOut() {
    return (
        <button className='w-10 h-30 text-xl' onClick={() => auth.signOut()}>
            Sair
        </button>
    );
}

export default App;
