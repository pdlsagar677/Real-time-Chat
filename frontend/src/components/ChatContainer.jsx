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
  const containerRef = useRef(null);

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
      <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <ChatHeader />

      {/* Chat Messages Container */}
      <div ref={containerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Start a conversation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Send your first message to {selectedUser?.fullName}
              </p>
            </div>
          )}

          {/* Messages */}
          {Object.entries(groupedMessages).map(([date, dayMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
                <div className="relative px-4">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400 rounded-full">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Messages for this date */}
              {dayMessages.map((message) => {
                const isUser = message.senderId === authUser._id;
                const time = formatMessageTime(message.createdAt);
                
                return (
                  <div
                    key={message._id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
                  >
                    <div className="flex gap-3 max-w-[85%] md:max-w-[75%]">
                      {/* Other user's avatar */}
                      {!isUser && (
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700">
                            <img
                              src={selectedUser.profilePic || "/avatar.png"}
                              alt={selectedUser.fullName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}

                      {/* Message Content */}
                      <div className={`space-y-1 ${isUser ? 'text-right' : 'text-left'}`}>
                        {/* Sender Name */}
                        {!isUser && (
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {selectedUser.fullName}
                          </p>
                        )}

                        {/* Message Bubble */}
                        <div className={`inline-block rounded-2xl p-4 ${
                          isUser
                            ? "bg-gray-900 text-white rounded-br-none"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none"
                        }`}>
                          {/* Image */}
                          {message.image && (
                            <div className="mb-3">
                              <img
                                src={message.image}
                                alt="Attachment"
                                className="max-w-full md:max-w-sm rounded-lg border border-gray-300 dark:border-gray-700"
                              />
                            </div>
                          )}

                          {/* Text */}
                          {message.text && (
                            <p className="whitespace-pre-wrap break-words">{message.text}</p>
                          )}
                        </div>

                        {/* Time & Status */}
                        <div className={`flex items-center gap-2 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <span className={`${isUser ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {time}
                          </span>
                          {isUser && (
                            <span className="text-gray-400">
                              {message.seen ? (
                                <CheckCheck className="w-4 h-4 text-blue-500" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* User's avatar */}
                      {isUser && (
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700">
                            <img
                              src={authUser.profilePic || "/avatar.png"}
                              alt={authUser.fullName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          
          <div ref={messageEndRef} />
        </div>
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;