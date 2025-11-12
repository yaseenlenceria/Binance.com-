import React, { useState, useEffect, useCallback } from 'react';
import { HangUpIcon, MuteIcon, UnmuteIcon, ReportIcon } from './Icons';
import { WebRTCProps } from '../types';

export const CallInterface: React.FC<WebRTCProps> = ({ 
    status, 
    partnerCountry, 
    isMuted, 
    startSearch, 
    hangUp, 
    toggleMute 
  }) => {
  const [callDuration, setCallDuration] = useState(0);
  const [autoCall, setAutoCall] = useState(true);

  useEffect(() => {
    let timer: number | undefined;
    if (status === 'connected') {
      setCallDuration(0);
      timer = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if(timer) clearInterval(timer);
      if (status !== 'connected') {
        setCallDuration(0);
      }
    };
  }, [status]);
  
  const handleHangUp = useCallback(() => {
    hangUp(autoCall);
  }, [hangUp, autoCall]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const renderStatusText = () => {
    switch (status) {
      case 'searching':
        return "Searching for a partner...";
      case 'connecting':
        return "Connecting...";
      case 'connected':
        return `Your partner is from ${partnerCountry}`;
      case 'disconnected':
        return `Call ended. ${autoCall ? 'Finding next...' : ''}`;
      default:
        return "";
    }
  };
  
  const isCallActive = status === 'connected' || status === 'connecting';
  const circleColor = isCallActive ? 'border-green-400' : 'border-gray-600';

  return (
    <div className="bg-[#121a41] p-6 rounded-xl flex flex-col items-center justify-between text-center min-h-[450px] h-full">
      <div className={`relative w-40 h-40 bg-[#1c2b68] rounded-full flex flex-col items-center justify-center border-4 ${circleColor} transition-colors duration-500 flex-shrink-0`}>
        <div className="text-4xl font-bold text-gray-300 select-none">A</div>
        <div className="text-sm text-gray-400 select-none">AIRTALK</div>
        {isCallActive && (
          <div className="absolute bottom-2 text-lg font-mono text-white bg-black bg-opacity-30 px-2 rounded">
            {formatTime(callDuration)}
          </div>
        )}
      </div>

      {status === 'idle' ? (
        <div className="flex-grow flex flex-col items-center justify-center">
            <button onClick={startSearch} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition-all shadow-lg shadow-green-500/20">Find a Stranger</button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-6 my-6">
            <button onClick={handleHangUp} disabled={!isCallActive} className="flex flex-col items-center gap-2 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:text-red-500 transition-colors">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                <HangUpIcon className="w-8 h-8 text-white"/>
              </div>
              <span className="text-sm">Hang up</span>
            </button>
            <button onClick={toggleMute} disabled={!isCallActive} className="flex flex-col items-center gap-2 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:text-white transition-colors">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                {isMuted ? <UnmuteIcon className="w-8 h-8 text-white"/> : <MuteIcon className="w-8 h-8 text-white"/>}
              </div>
              <span className="text-sm">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>
            <button disabled={!isCallActive} className="flex flex-col items-center gap-2 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:text-yellow-400 transition-colors">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                <ReportIcon className="w-8 h-8 text-yellow-500"/>
              </div>
              <span className="text-sm">Report</span>
            </button>
          </div>
          
          <div className="w-full flex justify-between items-center text-sm text-gray-400 mt-auto">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={autoCall} onChange={(e) => setAutoCall(e.target.checked)} className="form-checkbox bg-gray-700 border-gray-600 text-green-500 rounded focus:ring-green-500"/>
              Enable Auto Call
            </label>
            <a href="#" className="hover:text-white underline">Call History</a>
          </div>

          <div className="mt-4 text-lg h-8 flex items-center justify-center text-gray-300">
            <p>{renderStatusText()}</p>
          </div>
        </>
      )}
    </div>
  );
};
