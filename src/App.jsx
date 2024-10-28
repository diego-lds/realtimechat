import { Suspense, lazy } from "react";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { initializeApp } from "firebase/app";
import { config } from "./firebase/config";
import { getFirestore } from "firebase/firestore";
export const app = initializeApp(config);

export const db = getFirestore(app);

const auth = getAuth();

const ChatApp = lazy(() => import("./components/ChatApp"));
const SignIn = lazy(() => import("./components/SignIn"));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthWrapper />
    </Suspense>
  );
}

function AuthWrapper() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <LoadingScreen />; // Enquanto o estado de autenticação é carregado
  }

  return user ? <ChatApp /> : <SignIn />;
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen">
      <p>Carregando...</p>
    </div>
  );
}

export default App;
