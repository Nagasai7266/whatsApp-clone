import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Search, Plus, MoreVertical, MessageCircle, Users, Settings } from 'lucide-react';
import { Chat, User } from '../types';

interface SidebarProps {
  chats: Chat[];
  activeChat: string | null;
  currentUser: User;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChat,
  currentUser,
  onChatSelect,
  onNewChat,
  onLogout
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const filteredChats = chats.filter(chat =>
    chat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={currentUser.avatar || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop&crop=face'}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                onClick={() => setShowUserMenu(!showUserMenu)}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">{currentUser.name}</h2>
              <p className="text-sm text-gray-500">{currentUser.status}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onNewChat}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              title="New Chat"
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 w-48">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No chats yet</p>
            <p className="text-sm">Start a conversation to see it here</p>
          </div>
        ) : (
          filteredChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
                activeChat === chat.id ? 'bg-green-50 border-r-4 border-r-green-500' : ''
              }`}
            >
              <div className="relative mr-3">
                {chat.type === 'group' ? (
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                ) : (
                  <img
                    src={chat.avatar || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop&crop=face'}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                {chat.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(chat.lastMessage.timestamp), { addSuffix: false })}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                    {chat.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};