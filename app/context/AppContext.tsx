'use client';
import {
  createContext, useContext, useState, useEffect,
  ReactNode, Dispatch, SetStateAction
} from 'react';

interface Message {
  id: string;
  content: string;
  type: 'human' | 'ai';
}

type User = {
  id: string;
  user_name: string;
};

interface ChatContextType {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  input: string;
  setInput: (input: string) => void;
  conversationId: string | null;
  setConversationId: Dispatch<SetStateAction<string | null>>;
  setSpinnerLoading: Dispatch<SetStateAction<boolean>>;
  setLoadingMessages: Dispatch<SetStateAction<boolean>>;
  loadingMessages: boolean;
  spinnerLoading: boolean;
  setConversations: Dispatch<SetStateAction<{ id: string; agent_id: string; title: string; }[]>>;
  conversations: { id: string; agent_id: string; title: string; created_at?: string }[];
  isMinimized: boolean;
  setIsMinimized: Dispatch<SetStateAction<boolean>>;
  fetchConversations: () => Promise<void>;
  authMessage:string,
  setAuthMessage:(input: string) => void;
  showAuthMessage: Boolean,
  setShowAuthMessage:Dispatch<SetStateAction<boolean>>,
  fadeOut:Boolean,
  setFadeOut: Dispatch<SetStateAction<boolean>>,
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [spinnerLoading, setSpinnerLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [conversations, setConversations] = useState<{ id: string; agent_id: string; title: string; created_at?: string }[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [showAuthMessage, setShowAuthMessage] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);


  const login = (user: User, token: string) => {
    setUser(user);

    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const fetchConversations = async () => {
    if (!user) return;
    
    
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/conversations/${user.id}?offset=0&limit=100`,
        {
          method: "GET", // ✅ always good to be explicit
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        setConversations([]);
        return;
      }

      const sorted = [...data].sort((a, b) =>
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );

      setConversations(sorted);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      setConversations([]);
    }
  };
  
  
  // When user state changes, sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      fetchConversations();
      
      
    } else {
      localStorage.removeItem('user');
    }

  }, [user]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages, setMessages,
        input, setInput,
        conversationId, setConversationId,
        spinnerLoading, setSpinnerLoading,
        loadingMessages, setLoadingMessages,
        conversations, setConversations,
        fetchConversations,
        user, setUser,
        token,
        login,
        logout,
        isMinimized, setIsMinimized,
        authMessage, showAuthMessage,
        setShowAuthMessage, setAuthMessage,
        fadeOut, setFadeOut
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};
