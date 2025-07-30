import { useState, useEffect } from 'react';
import { MediaDevices } from '../types';

export const useMediaDevices = () => {
  const [mediaDevices, setMediaDevices] = useState<MediaDevices>({
    audioDevices: [],
    videoDevices: []
  });
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setMediaDevices({
          audioDevices: devices.filter(device => device.kind === 'audioinput'),
          videoDevices: devices.filter(device => device.kind === 'videoinput')
        });
      } catch (err) {
        setError('Failed to enumerate media devices');
      }
    };

    getDevices();
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, []);

  const requestPermissions = async (audio: boolean = true, video: boolean = false) => {
    try {
      setError(null);
      const constraints: MediaStreamConstraints = {
        audio: audio ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false,
        video: video ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        } : false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      return mediaStream;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access media devices';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  };

  return {
    mediaDevices,
    stream,
    error,
    requestPermissions,
    stopStream,
    toggleAudio,
    toggleVideo
  };
};