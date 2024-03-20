import { useEffect, useRef, useState } from 'react';

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
    const [messages, setMessages] = useState();
    const messagesRef = collection(db, 'messages');
    const dummy = useRef();

    useEffect(() => {
        const queryMessages = query(
            messagesRef,
            orderBy('createdAt')
            // limit(10)
        );

        const unsuscribe = onSnapshot(queryMessages, snapshot => {
            let messages = [];
            snapshot.forEach(doc => {
                const userIdMatch = doc.data().uid === user?.uid;
                console.log(doc.data().uid, user?.uid);
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

        dummy.current.scrollIntoView({ behavior: 'smooth' });
    };

    if (!auth.currentUser) {
        return (
            <>
                <SignIn />
            </>
        );
    } else {
        return (
            <>
                <header className='flex justify-between items-center bg-slate-900 text-white sticky top-0 z-10'>
                    <h1 className=' text-3xl font-bold m-5'>Realtime Chat</h1>
                    <div className='flex items-center m-2 gap-x-3'>
                        <h4 className='text-xl'>{user?.displayName}</h4>
                        <img
                            className='rounded-full border-2 '
                            alt='User'
                            src={user?.photoURL}
                            width={55}
                        />
                        <SignOut />
                    </div>
                </header>
                <section>
                    <ChatRoom
                        messages={messages}
                        reference={dummy}
                        userId={user?.currentUser?.uid}
                    />
                </section>

                <form
                    onSubmit={sendMessage}
                    className=' sticky bottom-0 w-screen drop-shadow-xl'
                >
                    <input
                        type='text'
                        value={text}
                        className='flex w-full min-h-[60px] p-5 rounded-md   border border-stone-300 border-input  text-md shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                        onChange={e => setText(e.target.value)}
                        placeholder='Digite uma mensagem'
                    />
                </form>
            </>
        );
    }
}

function SignIn() {
    const signInWithGoogle = () => {
        signInWithPopup(auth, new GoogleAuthProvider())
            .then(result => console.log(result))
            .catch(error => console.error({ error }));
    };

    return (
        <>
            <button
                type='button'
                onClick={signInWithGoogle}
                className='text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2'
            >
                <svg
                    className='w-4 h-4 me-2'
                    aria-hidden='true'
                    fill='currentColor'
                    viewBox='0 0 18 19'
                >
                    <path
                        fill-rule='evenodd'
                        d='M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z'
                        clip-rule='evenodd'
                    />
                </svg>
                Entrar na sala com Google
            </button>
        </>
        // <button
        //     onClick={signInWithGoogle}
        //     className='text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
        // >
        //     Entrar com google
        // </button>
    );
}

function SignOut() {
    return (
        <button
            className='w-10 h-30 ml-5 text-xl p-1 border border-black'
            onClick={() => auth.signOut()}
        >
            Sair
        </button>
    );
}

export default App;
