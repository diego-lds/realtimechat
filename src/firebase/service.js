import { addDoc } from 'firebase/firestore';

const sendMessageToFirestore = async (ref, message) => {
    await addDoc(ref, message);
};

export { sendMessageToFirestore };
