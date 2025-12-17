const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {skeletonMessages.map((_, idx) => {
          const isUser = idx % 2 === 0;
          
          return (
            <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div className="flex gap-3 max-w-[80%]">
                {!isUser && (
                  <div className="flex-shrink-0">
                    <div className="skeleton w-10 h-10 rounded-full" />
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className={`flex items-center gap-2 ${isUser ? "justify-end" : ""}`}>
                    {!isUser && <div className="skeleton h-3 w-20" />}
                  </div>
                  
                  <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`space-y-2 ${
                      isUser 
                        ? "bg-gray-200 dark:bg-gray-800" 
                        : "bg-gray-100 dark:bg-gray-800"
                    } p-4 rounded-2xl`}>
                      <div className="skeleton h-4 w-48" />
                      <div className="skeleton h-4 w-40" />
                    </div>
                  </div>
                  
                  <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div className="skeleton h-2 w-16" />
                  </div>
                </div>
                
                {isUser && (
                  <div className="flex-shrink-0">
                    <div className="skeleton w-10 h-10 rounded-full" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageSkeleton;