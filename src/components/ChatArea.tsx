import React, { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react';
import { Chat, Message, User, TypingIndicator } from '../types';

interface ChatAreaProps {
  chat: Chat | null;
  messages: Message[];
  currentUser: User;
  typingUsers: TypingIndicator[];
  onSendMessage: (content: string) => void;
  onStartTyping: () => void;
  onBack?: () => void;
  onAudioCall?: () => void;
  onVideoCall?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  chat,
  messages,
  currentUser,
  typingUsers,
  onSendMessage,
  onStartTyping,
  onBack,
  onAudioCall,
  onVideoCall
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojis = ['😀', '😂', '😍', '🤔', '👍', '❤️', '😢', '😮', '😡', '🎉'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    onStartTyping();
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload the file and get a URL
      onSendMessage(`📎 ${file.name}`);
    }
  };

  const getMessageStatus = (message: Message) => {
    if (message.senderId !== currentUser.id) return null;
    
    switch (message.status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return <span className="text-blue-500">✓✓</span>;
      default:
        return null;
    }
  };

  const chatTypingUsers = typingUsers.filter(t => t.chatId === chat?.id && t.userId !== currentUser.id);

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">WhatsApp Clone</h3>
          <p className="text-gray-600">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <img
              src={chat.avatar || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop&crop=face'}
              alt={chat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium text-gray-900">{chat.name}</h3>
              <p className="text-sm text-gray-500">
                {chatTypingUsers.length > 0
                  ? `${chatTypingUsers[0].userName} is typing...`
                  : 'Online'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={onAudioCall}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Audio Call"
            >
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={onVideoCall}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Video Call"
            >
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isOwn = message.senderId === currentUser.id;
          const showTimestamp = index === 0 || 
            new Date(messages[index - 1].timestamp).getDate() !== new Date(message.timestamp).getDate();

          return (
            <div key={message.id}>
              {showTimestamp && (
                <div className="text-center text-xs text-gray-500 my-4">
                  {format(new Date(message.timestamp), 'EEEE, MMMM d, yyyy')}
                </div>
              )}
              <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn
                      ? 'bg-green-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                  <div className={`flex items-center justify-end space-x-1 mt-1 text-xs ${
                    isOwn ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    <span>{format(new Date(message.timestamp), 'HH:mm')}</span>
                    {getMessageStatus(message)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {chatTypingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
            
            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 grid grid-cols-5 gap-1">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiClick(emoji)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`p-2 rounded-full transition-colors ${
              newMessage.trim()
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};