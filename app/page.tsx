'use client';

import { useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import GlassyFooter from './components/GlassyStickyBottom';
import ChatInput from './components/ChatInput';
import { useChat } from './context/AppContext';
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

  const { input, setInput, messages,
            setMessages, conversationId,
            setConversationId, setSpinnerLoading,
            setConversations,
            setLoadingMessages,
            conversations,
            loadingMessages, spinnerLoading,
            fetchConversations, isMinimized} = useChat();
  

  // Start a new conversation
  const handleNewConversation = () => {
    sessionStorage.removeItem("activeConversationId");
    setConversationId(null);
    setMessages([]);
    setInput('');
    inputRef.current?.focus();
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (id: string) => {
    setLoadingMessages(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/conversations/${id}/messages`);

      if (res.status === 404) {
        console.warn("Conversation not found (404).");
        sessionStorage.removeItem("activeConversationId"); // 🔥 This line fixes your bug
        setMessages([]);
        setConversationId(null); // optional: reset selection
        return;
      }

      if (!res.ok) {
        throw new Error(`Unexpected error: ${res.status}`);
      }

      const data = await res.json();
      setConversationId(id);
      sessionStorage.setItem("activeConversationId", id);
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };



  // Auto-resize textarea height
  const resizeTextArea = () => {
    const el = inputRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  };

  // Load last session
  useEffect(() => {
    const load = async () => {
      await fetchConversations(); // make sure conversation list is loaded first

      const lastId = sessionStorage.getItem("activeConversationId");

      if (lastId && conversations.some(conv => conv.id === lastId)) {
        fetchMessages(lastId);
      } else {
        sessionStorage.removeItem("activeConversationId");
      }
    };

    load();
  }, []);

  useEffect(() => {
    resizeTextArea();
  }, [input]);

  // Scroll to bottom on message update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  return (
    <div className="min-h-screen flex text-white">
      <Sidebar
        conversations={conversations}
        conversationId={conversationId}
        setConversationId={setConversationId}
        setMessages={setMessages}
        handleNewConversation={handleNewConversation}
        setLoadingMessages={setLoadingMessages}
        fetchMessages={fetchMessages}
      />
        {messages.length === 0 && (
          <h1 className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-white pointer-events-none">
            MEDIC
          </h1>
        )}
      {/* Main Chat Content */}
      <div className="flex flex-col flex-1 items-center">
        {/* Messages */}
        <div ref={containerRef} className="flex-1 w-5/6 overflow-y-auto px-4 py-4">
          <div className="flex flex-col space-y-4">
            {loadingMessages ? (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit whitespace-nowrap bg-gray-200/20 text-center p-4 rounded border-light-300 animate-pulse z-50">
                Loading messages...
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-5/6 px-4">
                  {messages.map((msg_obj) => (
                    <div key={msg_obj.id} className="flex flex-col items-start p-2">
                      <span className="text-md text-gray-100">
                        {msg_obj.type === 'human' ? 'Human:' : 'Bot:'}
                      </span>
                      <div className="bg-slate-800 px-4 text-gray-50 text-sm p-3 rounded shadow w-full break-words whitespace-pre-wrap overflow-hidden">
                        {msg_obj.content}
                      </div>
                      <hr />
                    </div>
                  ))}

                  {spinnerLoading && (
                    <div className="flex justify-start pl-2">
                      <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <div className="h-10" />
                  <div className="h-36" />
                  <div ref={bottomRef} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Input */}
        <ChatInput
          conversations={conversations}
          setConversations={setConversations}
          conversationId={conversationId}
          setConversationId={setConversationId}
          messages={messages}
          input={input}
          setInput={setInput}
          setMessages={setMessages}
          inputRef={inputRef}
          setSpinnerLoading={setSpinnerLoading}
        />

        <GlassyFooter />
      </div>
    </div>
  );
}
