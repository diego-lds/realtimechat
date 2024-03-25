import { limit, onSnapshot, orderBy, query } from 'firebase/firestore';

const LIMIT_MESSAGES = 5;

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
                const data = doc.data();
                messages.push({
                    ...data,
                });
            });

            setMessages(messages);
        } catch (e) {
            console.log(e);
        }
    });
}
