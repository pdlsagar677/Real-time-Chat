import { X, Video } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import VideoCall from "./VideoCall";

const ChatHeader = () => {
  const socket = useAuthStore((s) => s.socket);
  const authUser = useAuthStore((s) => s.authUser);
  const onlineUsers = useAuthStore((s) => s.onlineUsers);
  const { selectedUser, setSelectedUser } = useChatStore();

  const startVideoCall = () => {
    if (!socket || !authUser || !selectedUser) return;
    socket.emit("call:user", {
      from: authUser._id,
      to: selectedUser._id,
    });
  };

  if (!selectedUser) return null;

  return (
    <>
      <div className="p-2.5 border-b border-base-300 flex justify-between">
        <div>
          <h3>{selectedUser.fullName}</h3>
          <p>
            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={startVideoCall}>
            <Video />
          </button>
          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>
      <VideoCall />
    </>
  );
};

export default ChatHeader;
