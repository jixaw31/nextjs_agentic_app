"use client";

import { useChat } from './context/AppContext';

export default function ChatPage() {
  const { showAuthMessage, authMessage, fadeOut} = useChat();
  return (
    
  <div className="relative h-screen flex items-center justify-center">
    
    <div className="h-2/3 text-2xl font-semibold">Landing Page</div>
    {/* Top-right message */}
          {showAuthMessage && (
            <div
              className={`fixed top-4 h-4/5 right-4 p-3 rounded ${!authMessage.includes("out")?"bg-green-600":"bg-gray-400"} text-white text-sm shadow-lg transition-opacity duration-1000 ${
                fadeOut ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {authMessage}
            </div>
          )}
    {/* Centered content */}
  </div>
);
}
