"use client";

import React, { useEffect, useContext, useLayoutEffect } from "react";
import { useChat } from "../context/AppContext";

interface Conversation {
  id: string;
  title: string;
}

interface SidebarProps {
  conversations: Conversation[];
  conversationId: string | null;
  setConversationId: (id: string | null) => void;
  setMessages: (messages: any[]) => void; // type more specifically if available
  handleNewConversation: () => void;
  setLoadingMessages: React.Dispatch<React.SetStateAction<boolean>>;
  fetchMessages: (id: string) => Promise<void>;
}

const Sidebar: React.FC<SidebarProps> = ({
  // conversations,
  // conversationId,
  // setConversationId,
  handleNewConversation,
  fetchMessages,
}) => {
  const {
    input,
    conversationId,
    setConversationId,
    // user,
    conversations,
    fetchConversations,
    isMinimized,
    setIsMinimized,
  } = useChat();

  
  return (
    <div
      onMouseEnter={() => setIsMinimized(false)}
      onMouseLeave={() => setIsMinimized(true)}
      className={`fixed left-0 z-40 h-screen top-14 transition-all duration-300
            ${
              isMinimized
                ? "w-14 px-0 bg-dark-500 shadow-[inset_-4px_0_6px_-2px_rgba(255,255,255,0.4)]"
                : "z-50 w-[18%] p-4 bg-gray-900 shadow-[inset_-4px_0_6px_-2px_rgba(255,255,255,0.4)]"
            }
            `}
    >
    
      {isMinimized && (
        <div className="flex flex-col animate-pulse items-center text-white my-4 pr-2">
          <span className="text-sm">History</span>
          <span className="text-white text-sm">&#10148;</span>
        </div>
      )}

      <h2
        className={`text-lg font-bold mb-4 text-white transition-opacity duration-300 ${
          isMinimized ? "opacity-0" : "opacity-100"
        }`}
      >
        History
      </h2>

      {!isMinimized && (
        <button
          className="w-full mb-4 py-2 text-sm bg-blue-700 hover:bg-blue-800 text-white rounded transition"
          onClick={handleNewConversation}
        >
          + New
        </button>
      )}

      {/* Scrollable container for conversation list */}
      <div
        className={`transition-all duration-300 ${
          isMinimized
            ? "overflow-hidden"
            : "overflow-y-auto max-h-[calc(100vh-200px)] pr-1 dark-scrollbar"
        }`}
      >
        {conversations.length > 0 ? (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-2 rounded cursor-pointer mb-2 text-white transition-all
                    ${
                      !isMinimized && conversationId === conv.id
                        ? " bg-gray-500/90"
                        : ""
                    }
                    ${!isMinimized ? "bg-gray-800/80 hover:bg-gray-400/80" : ""}
                    ${isMinimized ? "text-center" : ""}`}
              onClick={() => fetchMessages(conv.id)}
            >
              <div
                className={`text-sm font-medium truncate transition-opacity ${
                  isMinimized ? "opacity-0" : "opacity-100"
                }`}
              >
                {conv.title || "Untitled"}
              </div>
            </div>
          ))
        ) : (
          !isMinimized && (
            <div className="text-white text-sm italic mt-4">No conversations found.</div>
          )
        )}
      </div>
    </div>
  );
};

export default Sidebar;
