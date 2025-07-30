import React from 'react';
import { Phone, PhoneOff } from 'lucide-react';
import { User } from '../types';

interface IncomingCallNotificationProps {
  caller: User;
  callType: 'audio' | 'video';
  onAccept: () => void;
  onReject: () => void;
}

export const IncomingCallNotification: React.FC<IncomingCallNotificationProps> = ({
  caller,
  callType,
  onAccept,
  onReject
}) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50 min-w-80 animate-bounce">
      <div className="flex items-center space-x-4">
        <img
          src={caller.avatar || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face'}
          alt={caller.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{caller.name}</h3>
          <p className="text-sm text-gray-600">
            Incoming {callType} call...
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onReject}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
          <button
            onClick={onAccept}
            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};