import { limit, onSnapshot, orderBy, query } from 'firebase/firestore';

const LIMIT_MESSAGES = 15;

export function observeMessages(ref, setMessages) {
    const queryMessages = query(
        ref,
        orderBy('createdAt', 'desc'),
        limit(LIMIT_MESSAGES)
    );
    return onSnapshot(queryMessages, snapshot => {
        let messages = [];

        try {
            snapshot.forEach(doc => {
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
