import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import app from './config';

const auth = getAuth();
const db = getFirestore(app);
export const messagesReference = collection(db, 'messages');

const sendMessageToFirestore = async message => {
    await addDoc(messagesReference, message);
};

const signInWithGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider())
        .then(result => console.log(result))
        .catch(error => console.error({ error }));
};

const logout = () => auth.signOut();

export { sendMessageToFirestore, signInWithGoogle, logout };
