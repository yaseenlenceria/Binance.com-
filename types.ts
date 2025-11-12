export type CallStatus = 'idle' | 'searching' | 'connecting' | 'connected' | 'disconnected';

export type WebSocketMessageType = 'find' | 'match' | 'signal';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  country?: string;
  data?: any;
}

export interface ChatMessage {
  sender: 'me' | 'partner';
  text: string;
  timestamp: number;
}

export interface WebRTCState {
  status: CallStatus;
  partnerCountry: string;
  myCountry: string;
  isMuted: boolean;
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
}

export interface WebRTCActions {
  startSearch: () => void;
  hangUp: (autoNext: boolean) => void;
  toggleMute: () => void;
  sendMessage: (message: string) => void;
}

export type WebRTCProps = WebRTCState & WebRTCActions;
