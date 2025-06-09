// interface ConversationPayload {
//   agent_id: string;
//   title: string;
//   message: string;
// }

// function getTitleFromMessage(message: string): string {
//   return message.trim().split(/\s+/).slice(0, 5).join(' ');
// }

// async function createConversation(agentId: string, userMessage: string) {
//   const payload: ConversationPayload = {
//     agent_id: agentId,
//     title: getTitleFromMessage(userMessage),
//     message: userMessage.trim(),
//   };

//   const response = await fetch('http://localhost:8000/conversations', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   });

//   if (!response.ok) {
//     // Handle error
//     throw new Error('Failed to create conversation');
//   }

//   return response.json();
// }

