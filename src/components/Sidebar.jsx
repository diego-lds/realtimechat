// Sidebar.js
import { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../App";

function Sidebar() {
  const [users, setUsers] = useState([]);

  const handleOnClick = (id) => {
    console.log(id);
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, []);
  console.log(users);
  return (
    <aside className="w-64 bg-slate-500 text-white h-screen p-4 ">
      <h2 className="text-lg font-semibold mb-4">Usuários</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="p-2 rounded hover:bg-slate-600">
            <div>
              <button onClick={() => handleOnClick(user.id)}>
                {user.displayName}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
