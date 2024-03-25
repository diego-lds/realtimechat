import { limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { messagesReference } from './service';

const LIMIT_MESSAGES = 5;

export function observeMessages(setMessages) {
    const queryMessages = query(
        messagesReference,
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
