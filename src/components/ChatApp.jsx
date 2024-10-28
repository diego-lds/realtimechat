import { useState } from "react";
import Profile from "./Profile";
import Content from "./Content";
import ChatRoom from "./ChatRoom";

import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

import SignOutButton from "./SignOutButton";
import Sidebar from "./Sidebar";

const auth = getAuth();

function ChatApp() {
  const [user, loading] = useAuthState(auth);
  const [activeChat, setActiveChat] = useState(null);

  const openChat = (chatId, user) => {
    setActiveChat({ chatId, user });
  };
  return (
    <div className="h-full  flex flex-col bg-slate-200">
      <header className="flex justify-between items-center p-4 bg-blue-600 text-white ">
        <Profile className="mr-2" user={user} />
        <SignOutButton handleSignOut={() => auth.signOut()} />
      </header>

      <div className="flex overflow-y-auto">
        <div className="min-h-screen flex-0">
          <Sidebar currentUserId={user.uid} openChat={openChat} />
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* <Content className="flex   bg-slate-100  overflow-y-auto"> */}
          {activeChat ? (
            <ChatRoom
              chatId={activeChat.chatId}
              user={activeChat.user}
              myUser={user}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">
                Selecione um usuário para iniciar um chat
              </p>
            </div>
          )}
          {/* </Content> */}
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
