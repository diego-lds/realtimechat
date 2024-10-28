import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function SignIn() {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
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
