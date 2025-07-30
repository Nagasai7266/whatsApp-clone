import React, { useState } from 'react';
import { X, User, Users, Search } from 'lucide-react';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (name: string, type: 'direct' | 'group') => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  onCreateChat
}) => {
  const [chatType, setChatType] = useState<'direct' | 'group'>('direct');
  const [chatName, setChatName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Demo contacts for realistic experience
  const demoContacts = [
    { id: '1', name: 'Alice Johnson', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop&crop=face' },
    { id: '2', name: 'Bob Smith', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop&crop=face' },
    { id: '3', name: 'Carol Davis', avatar: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop&crop=face' },
    { id: '4', name: 'David Wilson', avatar: 'https://images.pexels.com/photos/1239287/pexels-photo-1239287.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop&crop=face' }
  ];

  const filteredContacts = demoContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatType === 'group' && chatName.trim()) {
      onCreateChat(chatName.trim(), 'group');
      setChatName('');
      onClose();
    }
  };

  const handleContactSelect = (contact: typeof demoContacts[0]) => {
    onCreateChat(contact.name, 'direct');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-green-500 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">New Chat</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-green-600 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Chat Type Selector */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setChatType('direct')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                chatType === 'direct'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Direct Chat</span>
            </button>
            <button
              onClick={() => setChatType('group')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                chatType === 'group'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Group Chat</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {chatType === 'group' ? (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  placeholder="Enter group name..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!chatName.trim()}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  chatName.trim()
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Create Group
              </button>
            </form>
          ) : (
            <div className="p-6">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Contacts List */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredContacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => handleContactSelect(contact)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-800">{contact.name}</span>
                  </button>
                ))}
                {filteredContacts.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No contacts found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};