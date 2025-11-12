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
    <div className="relative bg-gradient-to-br from-indigo-950/50 via-purple-950/50 to-pink-950/50 p-6 rounded-3xl flex flex-col h-full min-h-[550px] backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-900/30 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-4 pb-4 border-b border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Chat
            </h3>
            <div className="flex items-center gap-2 -mt-1">
              {isChatOpen ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs text-green-400 font-semibold">Active</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                  <span className="text-xs text-gray-400 font-semibold">Unavailable</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Message count badge */}
        {chatMessages.length > 0 && (
          <div className="px-3 py-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full text-white text-xs font-bold shadow-lg">
            {chatMessages.length}
          </div>
        )}
      </div>

      {/* Messages container */}
      <div className="relative z-10 flex-grow rounded-2xl p-4 overflow-y-auto flex flex-col bg-gradient-to-br from-indigo-950/30 to-purple-950/30 backdrop-blur-sm border border-purple-500/10 shadow-inner">
        {chatMessages.length === 0 ? (
          <div className="m-auto text-center flex flex-col items-center gap-4">
            {isChatOpen ? (
              <>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border-2 border-purple-400/30">
                  <svg className="w-10 h-10 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-purple-200 font-semibold">Chat connected!</p>
                  <p className="text-purple-400 text-sm mt-1">Say hello 👋</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-600/20 to-gray-700/20 flex items-center justify-center border-2 border-gray-600/30">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold">Voice only</p>
                  <p className="text-gray-500 text-sm mt-1">Chat unavailable</p>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className="flex flex-col gap-1 max-w-[75%]">
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                      msg.sender === 'me'
                        ? 'bg-gradient-to-br from-cyan-600 to-purple-600 text-white rounded-br-none border border-cyan-400/30'
                        : 'bg-gradient-to-br from-purple-900/60 to-pink-900/60 text-white rounded-bl-none border border-purple-400/30'
                    }`}>
                    <p className="break-words leading-relaxed">{msg.text}</p>
                  </div>
                  <span className={`text-xs text-purple-400 px-2 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSend} className="relative z-10 mt-4">
        <div className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 ${
          isChatOpen
            ? 'bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/30 shadow-lg'
            : 'bg-gray-900/40 border border-gray-700/30'
        }`}>
          {/* Camera button */}
          <button
            type="button"
            disabled={true}
            className="p-2 rounded-xl bg-purple-800/30 text-gray-500 cursor-not-allowed opacity-50 transition-all"
            aria-label="Attach image">
            <CameraIcon className="w-5 h-5" />
          </button>

          {/* Text input */}
          <input
            type="text"
            placeholder={isChatOpen ? "Type your message..." : "Chat unavailable"}
            disabled={!isChatOpen}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow bg-transparent text-white placeholder-purple-400 outline-none disabled:cursor-not-allowed disabled:text-gray-500 font-medium"
            aria-label="Chat message input"
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={!isChatOpen || !message.trim()}
            className="group p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/50 disabled:hover:scale-100 disabled:hover:shadow-none"
            aria-label="Send message">
            <PaperAirplaneIcon className="w-5 h-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
};
