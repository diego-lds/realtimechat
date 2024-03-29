import ChatRoom from './components/ChatRoom';
import Profile from './components/Profile';
import ExitIcon from './assets/exit.svg';
import Content from './components/Content';

import { useEffect, useRef, useState } from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { observeMessages } from './firebase/observers';
import { sendMessageToFirestore } from './firebase/service';
import { collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { config } from './firebase/config';

const app = initializeApp(config);
const db = getFirestore(app);
const messagesReference = collection(db, 'messages');
const auth = getAuth();

function App() {
    const [user] = useAuthState(auth);
    const [messages, setMessages] = useState([]);
    const inputRef = useRef('');

    useEffect(() => {
        const observer = observeMessages(messagesReference, setMessages);
        return () => observer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSendMessage = async event => {
        event.preventDefault();

        sendMessageToFirestore(messagesReference, {
            text: inputRef.current.valueOf,
            uid: user.uid,
            sender: user.uid,
            photoURL: user.photoURL,
            displayName: user.displayName,
            createdAt: serverTimestamp(),
        });
        inputRef.current.valueOf = '';
    };

    if (!auth.currentUser) {
        return messages && <SignIn />;
    }

    return (
        <main className='h-full'>
            <header className='flex justify-between items-center  text-white sticky top-0 z-10'>
                {/* <h1 className=' ml-1'>Realtime Chat</h1> */}
                <Profile className='mr-1' user={user} />
                <SignOutButton />
            </header>
            <Content className='flex flex-col px-3 mt-6 md:px-3'>
                <section className=''>
                    {messages && user && (
                        <ChatRoom
                            messages={messages}
                            userId={user?.currentUser?.uid}
                        />
                    )}
                </section>
            </Content>
            <footer className='fixed bottom-0 w-full'>
                <form onSubmit={handleSendMessage}>
                    <input
                        ref={inputRef}
                        type='text'
                        className='w-full text-muted-foreground  p-1 rounded-md border border-stone-300 border-input placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed '
                        autoComplete='off'
                        spellCheck='false'
                        inputMode='verbatim'
                        maxLength={100}
                    />
                </form>
            </footer>
        </main>
    );
}

function SignOutButton() {
    return (
        <button
            className='border-l pl-4 pr-2 ml-4 border-l-white'
            onClick={() => auth.signOut()}
        >
            <span>
                <img src={ExitIcon} alt='empty profile' />
            </span>
        </button>
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
                <span>
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
                </span>
                Entrar com Google
            </button>
        </>
    );
}

export default App;
