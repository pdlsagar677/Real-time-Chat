import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile, Paperclip, Mic } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* Image Preview */}
      {imagePreview && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 text-white
                  flex items-center justify-center hover:bg-gray-800 transition-colors"
                  type="button"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Image ready to send</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Click send to share</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-4">
        <div className="flex items-end gap-3">
          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-transparent transition-all resize-none text-gray-900 dark:text-white"
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              rows="1"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            
            {/* Character Counter */}
            {text.length > 0 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {text.length}/1000
                </span>
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!text.trim() && !imagePreview}
            className="p-3 bg-gray-900 dark:bg-gray-800 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 dark:disabled:hover:bg-gray-800 flex items-center justify-center"
          >
            {text.trim() || imagePreview ? (
              <Send className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Hint Text */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
          Press Enter to send • Shift + Enter for new line
        </p>
      </form>
    </div>
  );
};

export default MessageInput;