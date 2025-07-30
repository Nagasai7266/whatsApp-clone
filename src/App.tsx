import React, { useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { NewChatModal } from './components/NewChatModal';
import { CallInterface } from './components/CallInterface';
import { IncomingCallNotification } from './components/IncomingCallNotification';
import { useAuth } from './hooks/useAuth';
import { useChat } from './hooks/useChat';
import { useCall } from './hooks/useCall';

function App() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { chats, messages, activeChat, typingUsers, sendMessage, setActiveChat, createNewChat, startTyping } = useChat(user);
  const { callState, initiateCall, receiveCall, acceptCall, rejectCall, endCall, toggleMute, toggleVideo } = useCall(user);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showChatArea, setShowChatArea] = useState(false);

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    setShowChatArea(true);
  };

  const handleBackToSidebar = () => {
    setShowChatArea(false);
    setActiveChat(null);
  };

  const handleSendMessage = (content: string) => {
    if (activeChat) {
      sendMessage(activeChat, content);
    }
  };

  const handleStartTyping = () => {
    if (activeChat) {
      startTyping(activeChat);
    }
  };

  const handleCreateNewChat = (name: string, type: 'direct' | 'group') => {
    const newChatId = createNewChat(name, type);
    if (newChatId) {
      setActiveChat(newChatId);
      setShowChatArea(true);
    }
    setShowNewChatModal(false);
  };

  const handleAudioCall = () => {
    const currentChat = chats.find(chat => chat.id === activeChat);
    if (currentChat && user) {
      // In a real app, you'd get the actual user data
      const recipient = {
        id: 'demo_user',
        name: currentChat.name || 'Unknown User',
        email: 'demo@example.com',
        avatar: currentChat.avatar,
        status: 'Available',
        lastSeen: new Date(),
        isOnline: true
      };
      initiateCall(recipient, 'audio');
    }
  };

  const handleVideoCall = () => {
    const currentChat = chats.find(chat => chat.id === activeChat);
    if (currentChat && user) {
      // In a real app, you'd get the actual user data
      const recipient = {
        id: 'demo_user',
        name: currentChat.name || 'Unknown User',
        email: 'demo@example.com',
        avatar: currentChat.avatar,
        status: 'Available',
        lastSeen: new Date(),
        isOnline: true
      };
      initiateCall(recipient, 'video');
    }
  };

  // Simulate incoming call (for demo purposes)
  const simulateIncomingCall = () => {
    if (user) {
      const caller = {
        id: 'demo_caller',
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
        status: 'Available',
        lastSeen: new Date(),
        isOnline: true
      };
      receiveCall(caller, 'video');
    }
  };

  if (!isAuthenticated) {
    return <AuthScreen onAuth={login} />;
  }

  const currentChat = chats.find(chat => chat.id === activeChat);
  const currentMessages = activeChat ? messages[activeChat] || [] : [];

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden relative">
      {/* Incoming Call Notification */}
      {callState.isIncoming && !callState.isConnected && callState.caller && (
        <IncomingCallNotification
          caller={callState.caller}
          callType={callState.callType!}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}

      {/* Call Interface */}
      {callState.isInCall && user && (
        <CallInterface
          callState={callState}
          currentUser={user}
          onEndCall={endCall}
          onAcceptCall={acceptCall}
          onRejectCall={rejectCall}
          onToggleMute={toggleMute}
          onToggleVideo={toggleVideo}
        />
      )}

      {/* Mobile Layout */}
      <div className="md:hidden w-full">
        {!showChatArea ? (
          <Sidebar
            chats={chats}
            activeChat={activeChat}
            currentUser={user!}
            onChatSelect={handleChatSelect}
            onNewChat={() => setShowNewChatModal(true)}
            onLogout={logout}
          />
        ) : (
          <ChatArea
            chat={currentChat || null}
            messages={currentMessages}
            currentUser={user!}
            typingUsers={typingUsers}
            onSendMessage={handleSendMessage}
            onStartTyping={handleStartTyping}
            onBack={handleBackToSidebar}
            onAudioCall={handleAudioCall}
            onVideoCall={handleVideoCall}
          />
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex w-full">
        <Sidebar
          chats={chats}
          activeChat={activeChat}
          currentUser={user!}
          onChatSelect={handleChatSelect}
          onNewChat={() => setShowNewChatModal(true)}
          onLogout={logout}
        />
        <ChatArea
          chat={currentChat || null}
          messages={currentMessages}
          currentUser={user!}
          typingUsers={typingUsers}
          onSendMessage={handleSendMessage}
          onStartTyping={handleStartTyping}
          onAudioCall={handleAudioCall}
          onVideoCall={handleVideoCall}
        />
      </div>

      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onCreateChat={handleCreateNewChat}
      />

      {/* Demo: Simulate incoming call button (remove in production) */}
      {!callState.isInCall && (
        <button
          onClick={simulateIncomingCall}
          className="fixed bottom-4 left-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg z-40"
        >
          Demo: Incoming Call
        </button>
      )}
    </div>
  );
}

export default App;