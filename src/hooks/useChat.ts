import { useState, useEffect, useCallback } from 'react';
import { Chat, Message, TypingIndicator, ChatState, User } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'whatsapp-clone-chats';

// Demo data for realistic chat experience
const createDemoChats = (currentUserId: string): { chats: Chat[], messages: { [key: string]: Message[] } } => {
  const demoUsers = [
    { id: 'demo1', name: 'Sarah Wilson', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face' },
    { id: 'demo2', name: 'Team Alpha', avatar: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=faces' },
    { id: 'demo3', name: 'Mike Chen', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face' },
    { id: 'demo4', name: 'Family Group', avatar: 'https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=faces' }
  ];

  const chats: Chat[] = demoUsers.map((user, index) => ({
    id: user.id,
    type: user.name.includes('Group') || user.name.includes('Team') ? 'group' : 'direct',
    name: user.name,
    participants: [currentUserId, user.id],
    unreadCount: index === 0 ? 2 : 0,
    avatar: user.avatar,
    createdAt: new Date(Date.now() - index * 86400000)
  }));

  const messages: { [key: string]: Message[] } = {
    'demo1': [
      {
        id: 'msg1',
        chatId: 'demo1',
        senderId: 'demo1',
        content: 'Hey! How are you doing?',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000),
        status: 'read'
      },
      {
        id: 'msg2',
        chatId: 'demo1',
        senderId: currentUserId,
        content: 'I\'m good! Just working on some new projects. How about you?',
        type: 'text',
        timestamp: new Date(Date.now() - 3000000),
        status: 'read'
      },
      {
        id: 'msg3',
        chatId: 'demo1',
        senderId: 'demo1',
        content: 'That sounds exciting! Would love to hear more about it sometime.',
        type: 'text',
        timestamp: new Date(Date.now() - 1800000),
        status: 'delivered'
      }
    ],
    'demo2': [
      {
        id: 'msg4',
        chatId: 'demo2',
        senderId: 'demo2',
        content: 'Team meeting at 3 PM today. Don\'t forget!',
        type: 'text',
        timestamp: new Date(Date.now() - 7200000),
        status: 'read'
      }
    ]
  };

  return { chats, messages };
};

export const useChat = (currentUser: User | null) => {
  const [chatState, setChatState] = useState<ChatState>({
    chats: [],
    messages: {},
    activeChat: null,
    typingUsers: []
  });

  useEffect(() => {
    if (!currentUser) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setChatState(data);
      } catch (error) {
        const demoData = createDemoChats(currentUser.id);
        setChatState({
          chats: demoData.chats,
          messages: demoData.messages,
          activeChat: null,
          typingUsers: []
        });
      }
    } else {
      const demoData = createDemoChats(currentUser.id);
      setChatState({
        chats: demoData.chats,
        messages: demoData.messages,
        activeChat: null,
        typingUsers: []
      });
    }
  }, [currentUser]);

  const saveToStorage = useCallback((newState: ChatState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  const sendMessage = useCallback((chatId: string, content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!currentUser || !content.trim()) return;

    const message: Message = {
      id: uuidv4(),
      chatId,
      senderId: currentUser.id,
      content: content.trim(),
      type,
      timestamp: new Date(),
      status: 'sent'
    };

    setChatState(prev => {
      const newMessages = {
        ...prev.messages,
        [chatId]: [...(prev.messages[chatId] || []), message]
      };

      const updatedChats = prev.chats.map(chat => 
        chat.id === chatId 
          ? { ...chat, lastMessage: message }
          : chat
      );

      const newState = {
        ...prev,
        messages: newMessages,
        chats: updatedChats
      };

      saveToStorage(newState);
      return newState;
    });

    // Simulate message delivery after a short delay
    setTimeout(() => {
      setChatState(prev => {
        const newMessages = {
          ...prev.messages,
          [chatId]: prev.messages[chatId]?.map(msg => 
            msg.id === message.id ? { ...msg, status: 'delivered' } : msg
          ) || []
        };

        const newState = { ...prev, messages: newMessages };
        saveToStorage(newState);
        return newState;
      });
    }, 1000);
  }, [currentUser, saveToStorage]);

  const setActiveChat = useCallback((chatId: string | null) => {
    setChatState(prev => {
      // Mark messages as read when opening a chat
      if (chatId) {
        const updatedMessages = {
          ...prev.messages,
          [chatId]: prev.messages[chatId]?.map(msg => 
            msg.senderId !== currentUser?.id ? { ...msg, status: 'read' } : msg
          ) || []
        };

        const updatedChats = prev.chats.map(chat =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        );

        const newState = {
          ...prev,
          activeChat: chatId,
          messages: updatedMessages,
          chats: updatedChats
        };

        saveToStorage(newState);
        return newState;
      }

      return { ...prev, activeChat: chatId };
    });
  }, [currentUser, saveToStorage]);

  const createNewChat = useCallback((name: string, type: 'direct' | 'group' = 'direct') => {
    if (!currentUser) return null;

    const newChat: Chat = {
      id: uuidv4(),
      type,
      name,
      participants: [currentUser.id],
      unreadCount: 0,
      createdAt: new Date(),
      avatar: type === 'group' ? 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=faces' : undefined
    };

    setChatState(prev => {
      const newState = {
        ...prev,
        chats: [newChat, ...prev.chats],
        messages: { ...prev.messages, [newChat.id]: [] }
      };

      saveToStorage(newState);
      return newState;
    });

    return newChat.id;
  }, [currentUser, saveToStorage]);

  const startTyping = useCallback((chatId: string) => {
    if (!currentUser) return;

    setChatState(prev => ({
      ...prev,
      typingUsers: [
        ...prev.typingUsers.filter(t => !(t.chatId === chatId && t.userId === currentUser.id)),
        { chatId, userId: currentUser.id, userName: currentUser.name }
      ]
    }));

    // Remove typing indicator after 3 seconds
    setTimeout(() => {
      setChatState(prev => ({
        ...prev,
        typingUsers: prev.typingUsers.filter(t => !(t.chatId === chatId && t.userId === currentUser.id))
      }));
    }, 3000);
  }, [currentUser]);

  return {
    ...chatState,
    sendMessage,
    setActiveChat,
    createNewChat,
    startTyping
  };
};