import { addDoc, collection } from "firebase/firestore";
import { db } from "../App";
const messagesReference = collection(db, "private-messages");

const sendMessageToFirestore = async (message) => {
  await addDoc(messagesReference, message);
};

// Função para enviar uma mensagem

export { sendMessageToFirestore };
