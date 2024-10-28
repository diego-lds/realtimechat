import { useEffect, useRef, useState } from "react";
import Profile from "./Profile";
import Content from "./Content";
import ChatRoom from "./ChatRoom";

import { collection, serverTimestamp } from "firebase/firestore";
import { sendMessageToFirestore } from "../firebase/service";

import { observePrivateChat } from "../firebase/observers";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

import SignOutButton from "./SignOutButton";
import { db } from "../App";
import Sidebar from "./Sidebar";

const messagesReference = collection(db, "private-messages");
const myId = "PYBzLBVgQJex85QCyCEKHNU94zl2";
const auth = getAuth();

function ChatApp() {
  const [user, loading] = useAuthState(auth);

  const [messages, setMessages] = useState([]);
  const inputRef = useRef("");
  const firstMessageRef = useRef(null);

  useEffect(() => {
    const observer = observePrivateChat(
      messagesReference,
      setMessages,
      user.uid,
      myId
    );
    return () => observer();
  }, [user]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    const text = inputRef.current.value.trim();
    if (!text) return;

    const message = {
      message: text,
      sender: user.uid,
      receiver: myId,
      createdAt: serverTimestamp(),
    };

    await sendMessageToFirestore(message);
    inputRef.current.value = "";
  };

  return (
    <main className="h-full flex flex-col bg-slate-200">
      <header className="flex justify-between items-center p-4 bg-blue-600 text-white sticky top-0 z-10 shadow-md">
        <Profile className="mr-2" user={user} />
        <SignOutButton handleSignOut={() => auth.signOut()} />
      </header>
      <Content className="flex flex-1 bg-slate-100 shadow-inner  overflow-y-auto">
        <Sidebar />
        <ChatRoom
          messages={messages}
          userId={user.uid}
          firstMessageRef={firstMessageRef}
        />
      </Content>
      <footer className="flex items-center p-4 fixed bottom-0 w-full">
        <form onSubmit={handleSendMessage} className="flex-grow">
          <input
            ref={inputRef}
            type="text"
            placeholder="Digite sua mensagem..."
            className="w-full p-2 text-lg rounded-full h-16 shadow-inner border border-blue-500 placeholder-gray-500 bg-white  focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
            autoComplete="off"
            spellCheck="false"
            maxLength={100}
          />
        </form>
      </footer>
    </main>
  );
}

export default ChatApp;
