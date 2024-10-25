import { limit, onSnapshot, orderBy, query, where } from "firebase/firestore";

const LIMIT_MESSAGES = 150;

export function observeMessages(ref, setMessages) {
  const queryMessages = query(
    ref,
    orderBy("createdAt", "desc"),
    limit(LIMIT_MESSAGES)
  );
  return onSnapshot(queryMessages, (snapshot) => {
    let messages = [];

    try {
      snapshot.forEach((doc) => {
        messages.push({
          ...doc.data(),
          msgId: doc.id,
        });
      });

      setMessages([...messages]);
    } catch (e) {
      console.log(e);
    }
  });
}

export function observeMessages2(ref, setMessages, currentUserId, myId) {
  console.log({ currentUserId, myId });
  const queryMessages = query(
    ref,
    where("sender", "in", [currentUserId, myId]),

    orderBy("createdAt", "desc"),
    limit(LIMIT_MESSAGES)
  );

  return onSnapshot(queryMessages, (snapshot) => {
    let messages = [];

    try {
      snapshot.forEach((doc) => {
        messages.push({
          ...doc.data(),
          msgId: doc.id,
        });
      });

      setMessages([...messages]);
    } catch (e) {
      console.log(e);
    }
  });
}
