import ChatRoom from './components/ChatRoom';
import UserProfile from './components/UserProfile';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import Input from './components/Input';

import { useEffect, useRef, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { observeMessages } from './firebase/observers';
import { sendMessageToFirestore } from './firebase/service';
import { serverTimestamp } from 'firebase/firestore';

const auth = getAuth();

function App() {
    const [user] = useAuthState(auth);
    const [messages, setMessages] = useState();
    const [text, setText] = useState('');
    const dummy = useRef();

    useEffect(() => {
        const observer = observeMessages(setMessages);
        return () => observer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSendMessage = async event => {
        event.preventDefault();

        sendMessageToFirestore({
            text,
            uid: user.uid,
            photoURL: user.photoURL,
            displayName: user.displayName,
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
                {messages && (
                    <ChatRoom
                        messages={messages}
                        userId={user?.currentUser?.uid}
                    />
                )}
            </section>

            <footer className='fixed bottom-0 w-full'>
                <form onSubmit={handleSendMessage}>
                    <Input text={text} setText={setText} />
                </form>
            </footer>
        </>
    );
}

export default App;
