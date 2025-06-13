"use client"

import React, { useState, useContext } from "react";
import { useChat } from "../context/AppContext";
import { useRouter, 
  useSearchParams
 } from 'next/navigation';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: (user: any) => void;
}


export default function SignInModal({ isOpen, onClose,
     onLogin
     }: SignInModalProps) {

  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectPath = searchParams.get('redirect') || '/404';
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { login,
        setShowAuthMessage, setAuthMessage,
        setFadeOut} = useChat();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { user_name: userName, password };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Sign in failed");
      }

      const data = await res.json();
      // 👇 Call `login()` to save user and token in context + localStorage
      login({ id: data.id, user_name: data.user_name }, data.access_token);
      router.push("/chat");
      router.replace(redirectPath);
      setAuthMessage("Signed in successfully!");
      setShowAuthMessage(true);
      setFadeOut(false); // make sure it's fully visible

      // Start fading out after 4 seconds
      setTimeout(() => {
        setFadeOut(true); // triggers CSS opacity transition
      }, 2000);

      // Remove from DOM after 5 seconds (4s delay + 1s fade duration)
      setTimeout(() => {
        setShowAuthMessage(false);
      }, 3000);
      
      // Save token to localStorage
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user_name", data.user_name);

      if (onLogin) onLogin(data);
      onClose();
    } catch (err: any) {
      console.error("Sign in error:", err);
      alert(err.message);
    }
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={()=>{handleCancel();
                            router.push("/")
              }}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
   
  );
}
