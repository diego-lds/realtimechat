import { addDoc, collection } from "firebase/firestore";

const sendMessageToFirestore = async (ref, message) => {
  await addDoc(ref, message);
};

// Função para enviar uma mensagem

export { sendMessageToFirestore };
