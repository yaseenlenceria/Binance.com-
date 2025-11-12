import React, { useState, useEffect, useRef } from 'react';
import { CameraIcon, PaperAirplaneIcon } from './Icons';
import { WebRTCProps } from '../types';

export const ChatWindow: React.FC<Partial<WebRTCProps>> = ({
  chatMessages = [],
  isChatOpen = false,
  sendMessage = () => {}
}) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isChatOpen) {
      sendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="bg-[#121a41] p-1 rounded-xl flex flex-col h-full min-h-[450px]">
      <div className="flex-grow rounded-lg p-4 overflow-y-auto flex flex-col bg-[#0d1333]">
        {chatMessages.length === 0 ? (
          <div className="m-auto text-center text-gray-500">
            {isChatOpen ? 'Chat connected. Say hello!' : 'Voice only. Chat is unavailable.'}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex items-end ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-xl ${msg.sender === 'me' ? 'bg-blue-600 rounded-br-none' : 'bg-[#2f3b7c] rounded-bl-none'}`}>
                  <p className="text-white break-words">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <form onSubmit={handleSend} className="p-2">
        <div className="flex items-center bg-[#2f3b7c] rounded-lg p-2">
          <input 
            type="text" 
            placeholder={isChatOpen ? "Send a message..." : "Chat unavailable"}
            disabled={!isChatOpen}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow bg-transparent text-white placeholder-gray-400 outline-none px-2 disabled:cursor-not-allowed"
            aria-label="Chat message input"
          />
          <button type="button" className="text-gray-400 p-2 cursor-not-allowed opacity-50" disabled aria-label="Attach image">
            <CameraIcon className="w-6 h-6" />
          </button>
          <button type="submit" className="text-gray-400 hover:text-white p-2 disabled:text-gray-600 disabled:cursor-not-allowed" disabled={!isChatOpen || !message.trim()} aria-label="Send message">
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
};
