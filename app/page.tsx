import { useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import GlassyFooter from './components/GlassyStickyBottom';
import ChatInput from './components/ChatInput';
import { useChat } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import { div } from 'framer-motion/client';

// import type { Message } from './types'; // Assume Message is exported from a shared types file


// interface Message {
//   id: string;
//   content: string;
//   type: "human" | "ai";
// }

// interface ChatInputProps {
//   input: string;
//   setInput: (val: string) => void;
//   messages: Message[];
//   setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
//   conversationId: string | null;
//   setConversationId: React.Dispatch<React.SetStateAction<string | null>>;
//   conversations: {
//     id: string;
//     agent_id: string;
//     title: string;
//   }[];
//   setConversations: React.Dispatch<
//     React.SetStateAction<{id: string; agent_id: string; title: string;}[]>>;

//   setSpinnerLoading: React.Dispatch<React.SetStateAction<boolean>>;
// }


export default function ChatPage() {

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const {authMessage, showAuthMessage,
        fadeOut} = useChat();


  return (
  <div className="relative h-screen flex items-center justify-center">
    {/* Top-right message */}
    {showAuthMessage && (
      <div
        className={`absolute top-4 mr-10 right-4 p-3 rounded ${!authMessage.includes("out")?"bg-green-600":"bg-gray-400"} text-white text-sm shadow-lg transition-opacity duration-1000 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {authMessage}
      </div>
    )}

    {/* Centered content */}
    <div className="h-2/3 text-2xl font-semibold">Landing Page</div>
  </div>
);
}
