import { X, Video, Phone } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useCallStore } from "../store/useCallStore";

const ChatHeader = () => {
  const onlineUsers = useAuthStore((s) => s.onlineUsers);
  const { selectedUser, setSelectedUser } = useChatStore();
  const callStatus = useCallStore((s) => s.callStatus);

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);
  const inCall = callStatus !== "idle";

  const handleCall = (type) => {
    useCallStore.getState().startCall(selectedUser, type);
  };

  return (
    <div className="p-2.5 border-b border-base-300 flex justify-between">
      <div>
        <h3>{selectedUser.fullName}</h3>
        <p>{isOnline ? "Online" : "Offline"}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleCall("audio")}
          disabled={!isOnline || inCall}
          className="btn btn-sm btn-ghost"
          title="Audio call"
        >
          <Phone className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleCall("video")}
          disabled={!isOnline || inCall}
          className="btn btn-sm btn-ghost"
          title="Video call"
        >
          <Video className="w-5 h-5" />
        </button>
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
