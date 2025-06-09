// context/ChatContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  type: 'human' | 'ai';
}

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: (input: string) => void;
  conversationId: string | null;
  // setConversationId: (id: string | null) => void;
  setSpinnerLoading:React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingMessages:React.Dispatch<React.SetStateAction<boolean>>;
  loadingMessages:boolean;
  spinnerLoading:boolean;
  setConversations: React.Dispatch<
    React.SetStateAction<{id: string; agent_id: string; title: string;}[]>>;
  // Add more state as needed
  conversations: {
    id: string;
    agent_id: string;
    title: string;
  }[];
  isMinimized:Boolean;
  setIsMinimized:React.Dispatch<React.SetStateAction<boolean>>;
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>;
  fetchConversations: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

// export type Conversation = {
//   id: string;
//   title: string;
//   // Add more fields if needed
// };



export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [spinnerLoading, setSpinnerLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  
  const [conversations, setConversations] = useState<{
    id: string;
    agent_id: string;
    title: string;
    created_at?: string;
  }[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const fetchConversations = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/conversations`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        console.log("No conversations found.");
        setConversations([]);  // Optionally clear the state
        return;
      }

      const sorted = [...data].sort((a, b) =>
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );

      setConversations(sorted);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  };

  
  
  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        input,
        setInput,
        conversationId,
        setConversationId,
        setSpinnerLoading,
        setConversations,
        loadingMessages,
        setLoadingMessages,
        conversations,
        spinnerLoading,
        fetchConversations,
        isMinimized, setIsMinimized
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
