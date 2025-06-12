'use client';

import { useState } from 'react';
import { useChat } from '../context/AppContext';
import SignInModal from '../components/SignInModal';  // adjust path as needed

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, login } = useChat();
  const [showSignIn, setShowSignIn] = useState(false);

  // Show SignInModal if no user
  if (!user) {
    return (
      <>
        <SignInModal
          isOpen={true}
          onClose={() => setShowSignIn(false)} // optionally handle modal close if you want
          onLogin={(loggedInUser) => {
                login(
                    { id: loggedInUser.id, user_name: loggedInUser.user_name },
                    loggedInUser.access_token
                );
                setShowSignIn(false);
                }}
        />
      </>
    );
  }

  // If user exists, render children (protected content)
  return <>{children}</>;
}
