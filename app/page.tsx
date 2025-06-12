

import { useChat } from './context/AppContext';

export default function ChatPage() {

  const {authMessage, showAuthMessage,
        fadeOut} = useChat();


  return (
    
  <div className="relative h-screen flex items-center justify-center">
    
    <div className="h-2/3 text-2xl font-semibold">Landing Page</div>
  </div>
);
}
