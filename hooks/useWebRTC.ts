import { useState, useRef, useEffect, useCallback } from 'react';
import { CallStatus, WebSocketMessage, ChatMessage, WebRTCProps } from '../types';

// Enhanced STUN/TURN configuration for NAT traversal
// Add your own TURN server credentials for production
const PEER_CONNECTION_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    // Uncomment and add your TURN server credentials for production:
    // {
    //   urls: 'turn:your-turn-server.com:3478',
    //   username: 'your-username',
    //   credential: 'your-password'
    // },
    // Xirsys TURN example:
    // {
    //   urls: ['turn:turn.example.com:3478?transport=udp', 'turn:turn.example.com:3478?transport=tcp'],
    //   username: 'username',
    //   credential: 'password'
    // }
  ],
  iceCandidatePoolSize: 10
};

const KEEPALIVE_INTERVAL = 25000; // 25 seconds
const RECONNECT_DELAYS = [2000, 4000, 8000, 16000]; // Exponential backoff

export const useWebRTC = (serverUrl: string): WebRTCProps => {
  const [status, setStatus] = useState<CallStatus>('idle');
  const [myCountry, setMyCountry] = useState<string>('🏳️');
  const [partnerCountry, setPartnerCountry] = useState<string>('🏳️');
  const [isMuted, setIsMuted] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const ws = useRef<WebSocket | null>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteAudio = useRef<HTMLAudioElement | null>(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);
  const userId = useRef<string>(crypto.randomUUID());
  const keepaliveTimer = useRef<number | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const reconnectTimer = useRef<number | null>(null);

  // Ref to hold startSearch function to break dependency cycle
  const startSearchRef = useRef<() => void>();

  const getFlag = useCallback((code: string): string => {
    return String.fromCodePoint(...[...code.toUpperCase()].map(c => 127397 + c.charCodeAt(0)));
  }, []);

  // Start keepalive mechanism
  const startKeepalive = useCallback(() => {
    if (keepaliveTimer.current) {
      clearInterval(keepaliveTimer.current);
    }

    keepaliveTimer.current = window.setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, KEEPALIVE_INTERVAL);
  }, []);

  // Stop keepalive mechanism
  const stopKeepalive = useCallback(() => {
    if (keepaliveTimer.current) {
      clearInterval(keepaliveTimer.current);
      keepaliveTimer.current = null;
    }
  }, []);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        if (data && data.country_code) {
          setMyCountry(getFlag(data.country_code));
        }
      }).catch(() => {
        // Silently fail, default flag is already set
      });

    remoteAudio.current = new Audio();
    remoteAudio.current.autoplay = true;

    return () => {
      stopKeepalive();
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
      ws.current?.close();
      pc.current?.close();
      localStream.current?.getTracks().forEach(track => track.stop());
    };
  }, [getFlag, stopKeepalive]);

  const setupDataChannelEvents = useCallback(() => {
    if (!dataChannel.current) return;
    dataChannel.current.onopen = () => {
      console.log('Data channel is open');
      setIsChatOpen(true);
    };
    dataChannel.current.onclose = () => {
      console.log('Data channel is closed');
      setIsChatOpen(false);
    };
    dataChannel.current.onmessage = (event) => {
      setChatMessages(prev => [...prev, { sender: 'partner', text: event.data, timestamp: Date.now() }]);
    };
    dataChannel.current.onerror = (error) => {
      console.error('Data channel error:', error);
    };
  }, []);
  
  const cleanupPeerConnection = () => {
    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }
    if (dataChannel.current) {
        dataChannel.current.close();
        dataChannel.current = null;
    }
    setIsChatOpen(false);
    setChatMessages([]);
  };

  // FIX: Reordered functions to resolve circular dependencies causing "used before declaration" error.
  // hangUp is now defined before functions that depend on it.
  const hangUp = useCallback((autoNext: boolean) => {
    ws.current?.close();
    cleanupPeerConnection();
    if (autoNext) {
        setStatus('disconnected');
        setTimeout(() => startSearchRef.current?.(), 1000);
    } else {
        setStatus('idle');
    }
  }, []);

  const createPeerConnectionAndOffer = async () => {
    cleanupPeerConnection();
    pc.current = new RTCPeerConnection(PEER_CONNECTION_CONFIG);
    
    dataChannel.current = pc.current.createDataChannel('chat');
    setupDataChannelEvents();

    pc.current.ondatachannel = (event) => {
        dataChannel.current = event.channel;
        setupDataChannelEvents();
    };

    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStream.current.getTracks().forEach(track => {
        track.enabled = !isMuted;
        pc.current?.addTrack(track, localStream.current!)
      });

      pc.current.ontrack = (event) => {
        if (remoteAudio.current) {
            remoteAudio.current.srcObject = event.streams[0];
            setStatus('connected');
        }
      };

      pc.current.onicecandidate = (event) => {
        if (event.candidate) {
          ws.current?.send(JSON.stringify({ type: 'signal', data: { candidate: event.candidate } }));
        }
      };
      
      pc.current.onconnectionstatechange = () => {
        const state = pc.current?.connectionState;
        console.log(`RTCPeerConnection state: ${state}`);

        if (state === 'connected') {
          reconnectAttempts.current = 0; // Reset on successful connection
        } else if (state === 'disconnected') {
          console.warn('Connection disconnected, attempting reconnection...');
          attemptReconnect();
        } else if (state === 'failed') {
          console.error('Connection failed, attempting reconnection...');
          attemptReconnect();
        } else if (state === 'closed') {
          if (status !== 'disconnected' && status !== 'idle') {
            hangUp(true);
          }
        }
      };

      pc.current.oniceconnectionstatechange = () => {
        const iceState = pc.current?.iceConnectionState;
        console.log(`ICE connection state: ${iceState}`);

        if (iceState === 'failed' || iceState === 'disconnected') {
          // ICE restart attempt
          if (pc.current && pc.current.restartIce) {
            console.log('Attempting ICE restart...');
            pc.current.restartIce();
          }
        }
      };
      
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      ws.current?.send(JSON.stringify({ type: 'signal', data: { sdp: offer } }));

    } catch (error) {
      console.error('Error starting voice call:', error);
      setStatus('idle');
    }
  };

  const handleSignal = async (data: any) => {
    if (!pc.current) {
        pc.current = new RTCPeerConnection(PEER_CONNECTION_CONFIG);
        pc.current.ondatachannel = (event) => {
            dataChannel.current = event.channel;
            setupDataChannelEvents();
        };
        try {
          localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
          localStream.current.getTracks().forEach(track => pc.current?.addTrack(track, localStream.current!));
        } catch(e) { console.error("Error getting user media on receiving end:", e)}
        pc.current.ontrack = (event) => {
            if (remoteAudio.current) {
                remoteAudio.current.srcObject = event.streams[0];
                setStatus('connected');
            }
        };
        pc.current.onicecandidate = (event) => {
            if (event.candidate) {
                ws.current?.send(JSON.stringify({ type: 'signal', data: { candidate: event.candidate } }));
            }
        };
    }
    
    if (data.sdp) {
      await pc.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
      if (data.sdp.type === 'offer') {
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answer);
        ws.current?.send(JSON.stringify({ type: 'signal', data: { sdp: answer } }));
      }
    } else if (data.candidate) {
      try {
        await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
  };

  // Reconnection logic with exponential backoff
  const attemptReconnect = useCallback(() => {
    if (reconnectAttempts.current >= RECONNECT_DELAYS.length) {
      console.error('Max reconnection attempts reached');
      hangUp(false);
      return;
    }

    const delay = RECONNECT_DELAYS[reconnectAttempts.current];
    console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current + 1}/${RECONNECT_DELAYS.length})`);

    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
    }

    reconnectTimer.current = window.setTimeout(() => {
      reconnectAttempts.current += 1;

      // Send reconnect message to server
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'reconnect' }));
      } else {
        // If WebSocket is closed, restart search
        startSearchRef.current?.();
      }
    }, delay);
  }, [hangUp]);

  const connectWebSocket = useCallback(() => {
    ws.current = new WebSocket(serverUrl);

    ws.current.onopen = () => {
      console.log('✅ WebSocket connected');
      reconnectAttempts.current = 0; // Reset reconnection attempts
      startKeepalive(); // Start keepalive
    };

    ws.current.onmessage = async (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      switch(message.type) {
        case 'match':
          console.log('✅ Match found with partner from', message.country);
          setPartnerCountry(message.country || '🏳️');
          setStatus('connecting');
          await createPeerConnectionAndOffer();
          break;
        case 'signal':
          await handleSignal(message.data);
          break;
        case 'pong':
          // Keepalive response received
          break;
        case 'searching':
          console.log('🔍 Searching for match...');
          break;
        case 'partnerDisconnected':
          console.log('⚠️  Partner disconnected');
          hangUp(true);
          break;
        case 'serverShutdown':
          console.warn('⚠️  Server shutting down');
          setStatus('disconnected');
          stopKeepalive();
          break;
        case 'timeout':
          console.warn('⏰ Matching timeout - no partner found');
          setStatus('idle');
          break;
      }
    };
    
    ws.current.onclose = () => {
      console.log('⚠️  WebSocket disconnected');
      stopKeepalive();

      if (status !== 'idle') {
        setStatus('disconnected');
        // Attempt to reconnect if not intentionally closed
        if (reconnectAttempts.current < RECONNECT_DELAYS.length) {
          attemptReconnect();
        }
      }
      cleanupPeerConnection();
    };

    ws.current.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      stopKeepalive();
      setStatus('disconnected');
      cleanupPeerConnection();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverUrl, status, startKeepalive, stopKeepalive, attemptReconnect]);
  
  const startSearch = useCallback(() => {
    if (ws.current?.readyState !== WebSocket.OPEN) {
      connectWebSocket();
    }
    setStatus('searching');
    const findInterval = setInterval(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'find', country: myCountry, id: userId.current }));
            clearInterval(findInterval);
        }
    }, 100);
  }, [connectWebSocket, myCountry]);

  useEffect(() => {
    startSearchRef.current = startSearch;
  }, [startSearch]);

  const toggleMute = useCallback(() => {
    setIsMuted(prevIsMuted => {
      const newMutedState = !prevIsMuted;
      if (localStream.current) {
        localStream.current.getAudioTracks().forEach(track => {
          track.enabled = !newMutedState;
        });
      }
      return newMutedState;
    });
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (dataChannel.current?.readyState === 'open') {
      dataChannel.current.send(text);
      setChatMessages(prev => [...prev, { sender: 'me', text, timestamp: Date.now() }]);
    }
  }, []);

  return { status, partnerCountry, myCountry, isMuted, chatMessages, isChatOpen, startSearch, hangUp, toggleMute, sendMessage };
};
