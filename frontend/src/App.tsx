import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Message {
  id: number;
  text: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    fetch(`${API_URL}/messages`)
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.error(error));
  }, []);

  const handleSendMessage = () => {
    fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newMessage }),
    })
      .then(response => response.json())
      .then(data => setMessages([...messages, data]))
      .catch(error => console.error(error));
    setNewMessage('');
  };

  return (
    <div>
      <h1>Chat App</h1>
      <ul>
        {messages.map(message => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newMessage}
        onChange={event => setNewMessage(event.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default App;