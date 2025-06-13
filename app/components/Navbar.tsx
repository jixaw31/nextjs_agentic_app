'use client';

import { Suspense } from "react";
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import SignupModal from './SignUpModal';
import SignInModal from './SignInModal';
import { useChat } from '../context/AppContext';
import { useRouter } from 'next/navigation';


export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showSignup, setShowSignup] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const {user, setUser, setShowAuthMessage,
         setFadeOut, setAuthMessage
  } = useChat();
  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setAuthMessage("Logged out!");
    setShowAuthMessage(true);
    setFadeOut(false); // make sure it's fully visible

    // Start fading out after 4 seconds
    setTimeout(() => {
      setFadeOut(true); // triggers CSS opacity transition
    }, 3000);

    // Remove from DOM after 5 seconds (4s delay + 1s fade duration)
    setTimeout(() => {
      setShowAuthMessage(false);
    }, 4000);
  };

  // Use this to set user and persist in localStorage
  const saveUserToStorage = (user: any) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const linkClasses = (path: string) =>
    `px-4 h-full flex items-center justify-center transition ${
      pathname === path ? 'bg-gray-700' : 'hover:bg-gray-500'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-gray-800 h-14 text-white">
      <Suspense fallback={<div>Loading...</div>}>
      <div className="flex items-center justify-between h-full px-4">
        {/* Left (placeholder if needed) */}
        <div />

        {/* Centered Nav Links */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 h-14 flex space-x-2">
          <Link href={{ pathname: '/chat', query: { redirect: '/chat' } }}
           className={linkClasses('/chat')}>
            Chat
          </Link>
          <Link href="/rag" className={linkClasses('/rag')}>
            RAG
          </Link>
          <Link href="/coder" className={linkClasses('/coder')}>
            CODER
          </Link>
        </div>

        {/* Right side: Username */}
        <div className="text-sm mr-10 h-full flex items-center p-1">
          {!user ? (
            <>
              <button
                className="h-1/2 mr-1 pr-2 text-blue-300 hover:text-gray-100 border-r border-white"
                onClick={() => {setShowSignIn(true);
                  router.push(`?redirect=/chat`);
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => setShowSignup(true)}
                className="h-1/2 text-blue-300 pl-1 hover:text-gray-100"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <span className="mr-4">Hello, {user.user_name}</span>
              <button
                onClick={()=>{handleLogout();
                              router.push("/")
                        }}
                className="h-full text-blue-300 p-1 hover:text-gray-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onLogin={(loggedInUser) => {
          saveUserToStorage(loggedInUser);
          setShowSignIn(false);
        }}
      />
      <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} />
    </Suspense>
    </nav>
  );
}
