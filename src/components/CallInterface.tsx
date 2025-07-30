import React, { useEffect, useRef, useState } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX } from 'lucide-react';
import { CallState, User } from '../types';
import { useMediaDevices } from '../hooks/useMediaDevices';

interface CallInterfaceProps {
  callState: CallState;
  currentUser: User;
  onEndCall: () => void;
  onAcceptCall: () => void;
  onRejectCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
}

export const CallInterface: React.FC<CallInterfaceProps> = ({
  callState,
  currentUser,
  onEndCall,
  onAcceptCall,
  onRejectCall,
  onToggleMute,
  onToggleVideo
}) => {
  const { stream, requestPermissions, stopStream, toggleAudio, toggleVideo } = useMediaDevices();
  const [callDuration, setCallDuration] = useState(0);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const otherUser = callState.caller || callState.recipient;

  useEffect(() => {
    if (callState.isInCall && callState.callType) {
      const isVideo = callState.callType === 'video';
      requestPermissions(true, isVideo).catch(console.error);
    }

    return () => {
      stopStream();
    };
  }, [callState.isInCall, callState.callType]);

  useEffect(() => {
    if (stream && localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState.isConnected && callState.callStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const start = new Date(callState.callStartTime!);
        setCallDuration(Math.floor((now.getTime() - start.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState.isConnected, callState.callStartTime]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleMute = () => {
    toggleAudio();
    onToggleMute();
  };

  const handleToggleVideo = () => {
    toggleVideo();
    onToggleVideo();
  };

  if (!callState.isInCall) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Video Area */}
      {callState.callType === 'video' ? (
        <div className="flex-1 relative">
          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            poster={otherUser?.avatar}
          />
          
          {/* Local Video */}
          {callState.isVideoEnabled && (
            <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
              <video
                ref={localVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
            </div>
          )}

          {/* User Info Overlay */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-6">
            <div className="flex items-center space-x-4">
              <img
                src={otherUser?.avatar || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face'}
                alt={otherUser?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h2 className="text-white text-xl font-semibold">{otherUser?.name}</h2>
                <p className="text-white/80 text-sm">
                  {callState.isConnected ? formatDuration(callDuration) : 
                   callState.isIncoming ? 'Incoming call...' : 'Calling...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Audio Call Interface */
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-green-400 via-green-500 to-green-600">
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <img
                src={otherUser?.avatar || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop&crop=face'}
                alt={otherUser?.name}
                className="w-full h-full rounded-full object-cover shadow-2xl"
              />
              {!callState.isConnected && (
                <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-pulse"></div>
              )}
            </div>
            <h2 className="text-white text-2xl font-semibold mb-2">{otherUser?.name}</h2>
            <p className="text-white/90 text-lg">
              {callState.isConnected ? formatDuration(callDuration) : 
               callState.isIncoming ? 'Incoming call...' : 'Calling...'}
            </p>
          </div>
        </div>
      )}

      {/* Call Controls */}
      <div className="bg-black/80 backdrop-blur-sm p-6">
        <div className="flex items-center justify-center space-x-6">
          {/* Speaker Toggle (Audio calls only) */}
          {callState.callType === 'audio' && (
            <button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`p-4 rounded-full transition-all ${
                isSpeakerOn ? 'bg-white text-gray-900' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>
          )}

          {/* Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className={`p-4 rounded-full transition-all ${
              callState.isMuted ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {callState.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Video Toggle (Video calls only) */}
          {callState.callType === 'video' && (
            <button
              onClick={handleToggleVideo}
              className={`p-4 rounded-full transition-all ${
                !callState.isVideoEnabled ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {callState.isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
          )}

          {/* End Call */}
          <button
            onClick={onEndCall}
            className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

        {/* Incoming Call Actions */}
        {callState.isIncoming && !callState.isConnected && (
          <div className="flex items-center justify-center space-x-8 mt-6">
            <button
              onClick={onRejectCall}
              className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all"
            >
              <PhoneOff className="w-8 h-8" />
            </button>
            <button
              onClick={onAcceptCall}
              className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all"
            >
              <Phone className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};