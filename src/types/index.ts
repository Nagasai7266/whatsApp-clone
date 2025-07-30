export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: string;
  lastSeen: Date;
  isOnline: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  replyTo?: string;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  avatar?: string;
  createdAt: Date;
}

export interface TypingIndicator {
  chatId: string;
  userId: string;
  userName: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface ChatState {
  chats: Chat[];
  messages: { [chatId: string]: Message[] };
  activeChat: string | null;
  typingUsers: TypingIndicator[];
}
export interface CallState {
  isInCall: boolean;
  callType: 'audio' | 'video' | null;
  isIncoming: boolean;
  caller?: User;
  recipient?: User;
  isConnected: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  callStartTime?: Date;
}

export interface MediaDevices {
  audioDevices: MediaDeviceInfo[];
  videoDevices: MediaDeviceInfo[];
  selectedAudioDevice?: string;
  selectedVideoDevice?: string;
}