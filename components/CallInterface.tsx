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

  return (
    <div className="relative bg-gradient-to-br from-indigo-950/50 via-purple-950/50 to-pink-950/50 p-8 rounded-3xl flex flex-col items-center justify-between text-center min-h-[550px] h-full backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-900/30 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>

      {/* Decorative circles */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-2xl"></div>

      {/* Main avatar circle */}
      <div className="relative z-10 mb-6">
        <div className={`relative w-52 h-52 rounded-full flex flex-col items-center justify-center transition-all duration-500 ${isCallActive ? 'scale-100' : 'scale-95'}`}>
          {/* Animated rings for active call */}
          {isCallActive && (
            <>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 animate-ping"></div>
              <div className="absolute -inset-4 rounded-full border-4 border-cyan-400/30 animate-spin" style={{animationDuration: '3s'}}></div>
              <div className="absolute -inset-2 rounded-full border-4 border-purple-400/30 animate-spin" style={{animationDuration: '4s', animationDirection: 'reverse'}}></div>
            </>
          )}

          {/* Main gradient circle */}
          <div className={`relative w-full h-full rounded-full flex flex-col items-center justify-center border-4 transition-all duration-500 ${isCallActive ? 'border-cyan-400 shadow-2xl shadow-cyan-500/50' : 'border-purple-600/40 shadow-xl shadow-purple-900/30'}`}
               style={{
                 background: isCallActive
                   ? 'linear-gradient(135deg, rgba(34, 211, 238, 0.2) 0%, rgba(147, 51, 234, 0.3) 50%, rgba(236, 72, 153, 0.2) 100%)'
                   : 'linear-gradient(135deg, rgba(88, 28, 135, 0.3) 0%, rgba(109, 40, 217, 0.3) 100%)'
               }}>
            <div className="text-7xl font-black bg-gradient-to-br from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent select-none drop-shadow-2xl">
              A
            </div>
            <div className="text-sm font-bold text-purple-300 select-none mt-2 tracking-widest">AIRTALK</div>

            {/* Call duration badge */}
            {isCallActive && (
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full shadow-2xl border border-cyan-400/50 backdrop-blur-sm">
                <div className="text-xl font-mono font-bold text-white drop-shadow-lg">
                  {formatTime(callDuration)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status text with country flag */}
      <div className="relative z-10 mb-6">
        {isCallActive && (
          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-900/60 to-pink-900/60 rounded-2xl border border-purple-400/30 backdrop-blur-sm shadow-lg">
            <span className="text-4xl animate-bounce">{partnerCountry}</span>
            <div className="text-left">
              <p className="text-xs text-purple-300 font-semibold">Connected with</p>
              <p className="text-lg text-white font-bold">{renderStatusText()}</p>
            </div>
          </div>
        )}
        {status === 'searching' && (
          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-900/60 to-blue-900/60 rounded-2xl border border-cyan-400/30 backdrop-blur-sm shadow-lg animate-pulse">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
            <p className="text-cyan-200 font-semibold">{renderStatusText()}</p>
          </div>
        )}
        {status === 'connecting' && (
          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 rounded-2xl border border-purple-400/30 backdrop-blur-sm shadow-lg">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
            <p className="text-purple-200 font-semibold">{renderStatusText()}</p>
          </div>
        )}
      </div>

      {status === 'idle' ? (
        <div className="relative z-10 flex-grow flex flex-col items-center justify-center gap-4">
          <button
            onClick={startSearch}
            className="group relative px-12 py-5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl text-white font-black text-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              <span>Find a Stranger</span>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>
          <p className="text-purple-300 text-sm">Connect instantly with strangers worldwide</p>
        </div>
      ) : (
        <>
          {/* Control buttons */}
          <div className="relative z-10 flex items-center gap-8 my-6">
            {/* Hang Up Button */}
            <button
              onClick={handleHangUp}
              disabled={!isCallActive}
              className="group flex flex-col items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110">
              <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 border-2 border-red-400/50">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-rose-500 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
                <HangUpIcon className="relative w-9 h-9 text-white drop-shadow-lg"/>
              </div>
              <span className="text-sm font-semibold text-red-300 group-hover:text-red-200">Hang up</span>
            </button>

            {/* Mute Button */}
            <button
              onClick={toggleMute}
              disabled={!isCallActive}
              className="group flex flex-col items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110">
              <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 border-2 border-purple-400/50">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
                {isMuted ? <UnmuteIcon className="relative w-9 h-9 text-white drop-shadow-lg"/> : <MuteIcon className="relative w-9 h-9 text-white drop-shadow-lg"/>}
              </div>
              <span className="text-sm font-semibold text-purple-300 group-hover:text-purple-200">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            {/* Report Button */}
            <button
              disabled={!isCallActive}
              className="group flex flex-col items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110">
              <div className="relative w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 border-2 border-amber-400/50">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
                <ReportIcon className="relative w-9 h-9 text-white drop-shadow-lg"/>
              </div>
              <span className="text-sm font-semibold text-amber-300 group-hover:text-amber-200">Report</span>
            </button>
          </div>

          {/* Bottom controls */}
          <div className="relative z-10 w-full flex justify-between items-center text-sm mt-auto pt-4 border-t border-purple-500/20">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={autoCall}
                  onChange={(e) => setAutoCall(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-purple-900/50 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-purple-500 transition-all duration-300 border border-purple-500/30"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5 shadow-lg"></div>
              </div>
              <span className="text-purple-300 font-medium group-hover:text-purple-200 transition-colors">Enable Auto Call</span>
            </label>
            <a href="#" className="text-purple-400 hover:text-purple-200 underline font-medium transition-colors flex items-center gap-1 group">
              <span>Call History</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </>
      )}
    </div>
  );
};
