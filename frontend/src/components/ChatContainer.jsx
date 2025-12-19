import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Check, CheckCheck } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-white dark:bg-gray-900">
      <ChatHeader />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No messages yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Send your first message to {selectedUser?.fullName}
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isUser = message.senderId === authUser._id;
            
            return (
              <div
                key={message._id}
                className={`chat ${isUser ? "chat-end" : "chat-start"}`}
              >
                {/* Avatar */}
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border border-gray-200 dark:border-gray-700">
                    <img
                      src={
                        isUser
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Message Time */}
                <div className="chat-header">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>

                {/* Message Bubble */}
                <div className={`chat-bubble flex flex-col ${
                  isUser 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                }`}>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="max-w-full md:max-w-sm rounded-md mb-2"
                    />
                  )}
                  {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
                </div>

                {/* Read Status */}
                {isUser && (
                  <div className="chat-footer opacity-70 flex items-center gap-1">
                    {message.seen ? (
                      <CheckCheck className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;