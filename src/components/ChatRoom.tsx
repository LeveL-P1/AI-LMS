import React, { useEffect, useState } from 'react';

interface Message {
  id: string;
  sender: string;
  content: string;
}

interface ChatRoomProps {
  courseId: string;
}

export function ChatRoom({ courseId }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Fetch initial messages or connect to websocket if implemented
  }, [courseId]);

  return (
    <div>
      <h3>Course Chat</h3>
      <div>
        {messages.map(m => (
          <p key={m.id}><strong>{m.sender}:</strong> {m.content}</p>
        ))}
      </div>
      {/* Add input form to send messages */}
    </div>
  );
}
