import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "../App"; // Importe sua instância do Firestore
import { doc, getDoc, setDoc } from "firebase/firestore";

function SignIn() {
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(getAuth(), provider);
      const { user } = result;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-700 to-blue-300">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Bem-vindo ao Chat
        </h1>
        <button
          onClick={signInWithGoogle}
          className="flex items-center w-full py-3 px-4 text-white bg-blue-500 rounded-lg"
        >
          Entrar com Google
        </button>
      </div>
    </div>
  );
}

export default SignIn;
