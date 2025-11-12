import { useState, useRef, useEffect, useCallback } from 'react';
import { CallStatus, WebSocketMessage, ChatMessage, WebRTCProps } from '../types';

const PEER_CONNECTION_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

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

  // Ref to hold startSearch function to break dependency cycle
  const startSearchRef = useRef<() => void>();

  const getFlag = useCallback((code: string): string => {
    return String.fromCodePoint(...[...code.toUpperCase()].map(c => 127397 + c.charCodeAt(0)));
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
      ws.current?.close();
      pc.current?.close();
      localStream.current?.getTracks().forEach(track => track.stop());
    };
  }, [getFlag]);

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
        if (state === 'disconnected' || state === 'failed' || state === 'closed') {
           if(status !== 'disconnected') {
              hangUp(true); // Assuming auto-next on unexpected disconnect
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

  const connectWebSocket = useCallback(() => {
    ws.current = new WebSocket(serverUrl);
    
    ws.current.onopen = () => console.log('WebSocket connected');

    ws.current.onmessage = async (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      switch(message.type) {
        case 'match':
          setPartnerCountry(message.country || '🏳️');
          setStatus('connecting');
          await createPeerConnectionAndOffer();
          break;
        case 'signal':
          await handleSignal(message.data);
          break;
      }
    };
    
    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      if (status !== 'idle') {
        setStatus('disconnected');
      }
      cleanupPeerConnection();
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatus('disconnected');
      cleanupPeerConnection();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverUrl, status]);
  
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
