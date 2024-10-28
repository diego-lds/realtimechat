import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../App";

function Sidebar({ currentUserId, openChat }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((user) => user.id !== currentUserId);
        setUsers(usersList);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, [currentUserId]);

  const startChat = async (selectedUser) => {
    const chatId = [currentUserId, selectedUser.id].sort().join("_");
    const chatRef = doc(db, "chats", chatId);
    await setDoc(
      chatRef,
      {
        participants: [currentUserId, selectedUser.id],
        createdAt: new Date(),
      },
      { merge: true }
    );

    openChat(chatId, selectedUser);
  };

  return (
    <aside className="bg-gray-800 h-full text-white p-2 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Usuários</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => startChat(user)}
            className="p-1 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <img
                src={user.photoURL || "default-profile.svg"}
                className="size-12 rounded-full"
              />
              <p className="hidden md:block">
                {" "}
                {user.displayName || "Nome não encontrado"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
