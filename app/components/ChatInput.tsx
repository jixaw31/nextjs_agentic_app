'use client';
import { useEffect, RefObject, useState } from 'react';
import { motion } from 'framer-motion';
import { useChat } from '../context/AppContext';

interface Message {
  id: string;
  content: string;
  type: "human" | "ai";
}

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  conversationId: string | null;
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>;
  conversations: {
    id: string;
    agent_id: string;
    title: string;
  }[];
  setConversations: React.Dispatch<
    React.SetStateAction<{id: string; agent_id: string; title: string;}[]>>;

  inputRef: RefObject<HTMLTextAreaElement | null>;
  setSpinnerLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatInput: React.FC<ChatInputProps> = ({
    // input,
    // setInput,
    // setMessages,
    // setConversationId,
    // setConversations,
    // conversationId,
    inputRef,
    // setSpinnerLoading,
    // messages,
    // conversations,
}) => {
  const { input, setInput, messages,
          setMessages, conversationId,
          setConversationId, setSpinnerLoading,
          fetchConversations} = useChat();

  // const [hasTyped, setHasTyped] = useState(false);
  const [hasSentMessage, setHasSentMessage] = useState(false);
  useEffect(() => {
    // Focus the input when component mounts
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
  if (!input.trim()) return;

  setSpinnerLoading(true);

  const userStr = localStorage.getItem("user");

  if (!userStr) {
    console.error("User not found in localStorage");
    setSpinnerLoading(false);
    return;
  }

  const user = JSON.parse(userStr);
  const userId = user.id;

  const userMessage: Message = {
    id: crypto.randomUUID(),
    content: input,
    type: 'human',
  };
  setMessages(prev => [...prev, userMessage]);

  let activeConversationId = conversationId;
  const firstFiveWords = input.trim().split(/\s+/).slice(0, 5).join(' ');
  const currentInput = input;
  setInput(''); // Clear input early for snappy UX

  try {
    // 🧠 STEP 1: Always create a new conversation if none is active
    if (!activeConversationId) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: firstFiveWords,
          user_id: userId,
        }),
      });

      if (!res.ok) throw new Error('Failed to create conversation');

      const newConv = await res.json();
      activeConversationId = newConv.id;
      setConversationId(newConv.id);
      localStorage.setItem("activeConversationId", newConv.id);
      await fetchConversations(); // optional: refresh sidebar
    }

    // 🧠 STEP 2: Send message to the correct conversation
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/conversations/${activeConversationId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: currentInput,
        user_id: userId,
      }),
    });

    if (!res.ok) throw new Error(`Failed to send message (HTTP ${res.status})`);

    const data = await res.json();

    const botMessage: Message = {
      content: Array.isArray(data.assistant)
        ? data.assistant[0]
        : "❌ Connection issue: the model or endpoint was not found. Please try again later.",
      type: 'ai',
      id: crypto.randomUUID(),
    };

    setMessages(prev => [...prev, botMessage]);
    setHasSentMessage(true);
  } catch (err) {
    console.error('Error during message sending:', err);
  } finally {
    setSpinnerLoading(false);
  }
};




  useEffect(() => {
    if (messages.length > 0) {
      setHasSentMessage(true);
    } else {
      setHasSentMessage(false);
    }
  }, [conversationId, messages]);

  return (
    <motion.div
      initial={{ top: "65%", left: "50%", translateX: "-50%", translateY: "-50%", position: "fixed" }}
      animate={
        hasSentMessage
          ? { top: "auto", bottom: "5rem", left: "50%", translateX: "-50%", translateY: "0%", position: "fixed" }
          : {}
      }
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-[63.5%] mx-auto mb-2 flex gap-2"
    >
    
      <textarea
        ref = {inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        rows={1}
        className="flex-1 resize-none overflow-hidden bg-gray-700 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
        placeholder="Type your message..."
        style={{ maxHeight: '160px' }}
      />
      <button
        onClick={sendMessage}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Send
      </button>
    </motion.div>
  );
};

export default ChatInput;