import React from 'react';
import { Header } from './components/Header';
import { CallInterface } from './components/CallInterface';
import { ChatWindow } from './components/ChatWindow';
import { Footer } from './components/Footer';
import { useWebRTC } from './hooks/useWebRTC';

function App() {
  // Use local server in development, or set via environment variable
  const serverUrl = import.meta.env.VITE_WS_SERVER_URL || 'ws://localhost:8080';
  const webRTCProps = useWebRTC(serverUrl);

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1333] overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CallInterface {...webRTCProps} />
            <ChatWindow {...webRTCProps} />
          </div>
          <div className="mt-8">
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
