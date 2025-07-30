import { useState, useCallback, useRef } from 'react';
import { CallState, User } from '../types';

export const useCall = (currentUser: User | null) => {
  const [callState, setCallState] = useState<CallState>({
    isInCall: false,
    callType: null,
    isIncoming: false,
    isConnected: false,
    isMuted: false,
    isVideoEnabled: false
  });

  const callTimeoutRef = useRef<NodeJS.Timeout>();

  const initiateCall = useCallback((recipient: User, callType: 'audio' | 'video') => {
    if (!currentUser) return;

    setCallState({
      isInCall: true,
      callType,
      isIncoming: false,
      recipient,
      isConnected: false,
      isMuted: false,
      isVideoEnabled: callType === 'video',
      callStartTime: new Date()
    });

    // Simulate call connection after 3 seconds
    callTimeoutRef.current = setTimeout(() => {
      setCallState(prev => ({
        ...prev,
        isConnected: true
      }));
    }, 3000);
  }, [currentUser]);

  const receiveCall = useCallback((caller: User, callType: 'audio' | 'video') => {
    setCallState({
      isInCall: true,
      callType,
      isIncoming: true,
      caller,
      isConnected: false,
      isMuted: false,
      isVideoEnabled: callType === 'video'
    });
  }, []);

  const acceptCall = useCallback(() => {
    setCallState(prev => ({
      ...prev,
      isIncoming: false,
      isConnected: true,
      callStartTime: new Date()
    }));
  }, []);

  const rejectCall = useCallback(() => {
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
    }
    setCallState({
      isInCall: false,
      callType: null,
      isIncoming: false,
      isConnected: false,
      isMuted: false,
      isVideoEnabled: false
    });
  }, []);

  const endCall = useCallback(() => {
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
    }
    setCallState({
      isInCall: false,
      callType: null,
      isIncoming: false,
      isConnected: false,
      isMuted: false,
      isVideoEnabled: false
    });
  }, []);

  const toggleMute = useCallback(() => {
    setCallState(prev => ({
      ...prev,
      isMuted: !prev.isMuted
    }));
  }, []);

  const toggleVideo = useCallback(() => {
    setCallState(prev => ({
      ...prev,
      isVideoEnabled: !prev.isVideoEnabled
    }));
  }, []);

  return {
    callState,
    initiateCall,
    receiveCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo
  };
};