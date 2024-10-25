import { Suspense, useEffect, useRef, useState } from "react";
import ChatRoom from "./components/ChatRoom";
import Profile from "./components/Profile";
import ExitIcon from "./assets/exit.svg";
import Content from "./components/Content";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { observeMessages2 } from "./firebase/observers";
import { sendMessageToFirestore } from "./firebase/service";
import { collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { config } from "./firebase/config";

const myId = "PYBzLBVgQJex85QCyCEKHNU94zl2";

const app = initializeApp(config);
const db = getFirestore(app);
const messagesReference = collection(db, "messages");
const auth = getAuth();

function App() {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const inputRef = useRef("");
  const firstMessageRef = useRef(null); // Ref para a primeira mensagem
  useEffect(() => {
    if (!user) return;
    const observer = observeMessages2(
      messagesReference,
      setMessages,
      user.uid,
      myId
    );
    return () => observer();
  }, []);

  useEffect(() => {
    if (firstMessageRef.current) {
      firstMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    const message = inputRef.current.value.trim();
    if (!message) return;

    await sendMessageToFirestore(messagesReference, {
      text: message,
      uid: user.uid,
      sender: user.uid,
      receiver: myId,
      photoURL: user.photoURL,
      displayName: user.displayName,
      createdAt: serverTimestamp(),
    });
    inputRef.current.value = "";
  };

  if (!auth.currentUser) {
    return <SignIn />;
  }

  return (
    <main className="h-full flex flex-col bg-slate-200">
      <div ref={firstMessageRef} />
      <header className="flex justify-between items-center p-4 bg-blue-600 text-white sticky top-0 z-10 shadow-md">
        <Profile className="mr-2" user={user} />
        <SignOutButton />
      </header>
      <Content className="flex flex-col flex-grow px-4 py-6 md:px-8 bg-white shadow-inner rounded-t-lg overflow-y-auto">
        <section className="flex-grow pb-24">
          <Suspense fallback={<span>Carregando mensagens...</span>}>
            {messages.length > 0 ? (
              <>
                <ChatRoom
                  messages={messages}
                  userId={user?.uid}
                  firstMessageRef={firstMessageRef} // Passa a ref para o ChatRoom
                />
                {/* Marca para rolar até o final */}
              </>
            ) : (
              <p className="text-center text-gray-500 mt-4">
                Nenhuma mensagem ainda.
              </p>
            )}
          </Suspense>
        </section>
      </Content>
      <footer className="flex items-center p-4 fixed bottom-0 w-full">
        <form onSubmit={handleSendMessage} className="flex-grow">
          <input
            ref={inputRef}
            type="text"
            placeholder="Digite sua mensagem..."
            className="w-full p-4 text-xl rounded-full h-20 border border-blue-500 placeholder-gray-400 bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out  outline-none"
            autoComplete="off"
            spellCheck="false"
            inputMode="verbatim"
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
      className="flex items-center px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded transition duration-200"
      onClick={() => auth.signOut()}
    >
      <img
        src={ExitIcon}
        alt="Logout"
        width={20}
        height={20}
        className="mr-2"
      />
      Sair
    </button>
  );
}

function SignIn() {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error("Erro ao autenticar com Google:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-700">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Bem-vindo ao Chat
        </h1>
        <p className="text-gray-600 mb-6">
          Entre com sua conta Google para começar a conversar!
        </p>
        <button
          type="button"
          onClick={signInWithGoogle}
          className="flex items-center justify-center w-full py-3 px-4 text-white bg-[#4285F4] hover:bg-[#357ae8] rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4]"
        >
          <GoogleIcon />
          <span className="ml-2">Entrar com Google</span>
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 18 18"
      aria-hidden="true"
    >
      <path d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" />
    </svg>
  );
}

export default App;
