import { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../App";
import ChatBaloon from "./ChatBaloon";

function ChatRoom({ chatId, user, myUser }) {
  const [messages, setMessages] = useState([]);
  const inputRef = useRef("");
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesList);
    });

    return unsubscribe;
  }, [chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const value = inputRef.current.value.trim();
    if (value === "") return;

    const messagesRef = collection(db, "chats", chatId, "messages");

    await addDoc(messagesRef, {
      text: value,
      senderId: myUser.uid,
      senderName: myUser.displayName,
      photoURL: myUser.photoURL,
      createdAt: new Date(),
    });

    inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col flex-0  ">
      <header className="flex items-center justify-between p-4 bg-blue-400 text-white shadow-md">
        <div className="flex items-center gap-2">
          <img
            src={user.photoURL || "/assets/profile.svg"}
            alt={`${user.displayName} profile`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="text-lg font-semibold">{user.displayName}</p>
        </div>
      </header>
      <div className="flex-grow h-screen  flex-col overflow-y-auto p-4 pb-24 bg-gray-100">
        {messages.map((msg) => (
          <ChatBaloon
            key={msg.id}
            message={msg.text || ""}
            senderName={msg.senderName}
            photoURL={msg.photoURL}
            isOwnMessage={msg.senderId === myUser.uid}
            timestamp={msg.createdAt.toDate()}
          />
        ))}
      </div>
      {/* Formulário de Envio */}
      <footer className="fixed w-full bottom-0 p-4 mb-4 ">
        <form onSubmit={handleSendMessage} className="   rounded-full w-full ">
          <input
            ref={inputRef}
            type="text"
            placeholder="Digite sua mensagem..."
            className="w-full p-3 text-lg rounded-full border border-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
            autoComplete="off"
            spellCheck="false"
            maxLength={200}
          />
        </form>
      </footer>
      <div ref={endOfMessagesRef} />
    </div>
  );
}

export default ChatRoom;
