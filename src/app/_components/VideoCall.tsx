'use client';

import Peer from 'peerjs';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useRef, useState } from 'react';

const VideoCall = () => {
    const { userId } = useAuth();
    const peerRef = useRef<Peer | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [remotePeerId, setRemotePeerId] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');

    useEffect(() => {
        const peer = new Peer(userId as string, {
            host: 'your-vercel-app-name.vercel.app',
            port: 443,
            path: '/myapp',
            secure: true
        });
        peerRef.current = peer;

        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            setConnectionStatus('Connected to server');
        });

        peer.on('call', handleIncomingCall);

        peer.on('error', (error) => {
            console.error('PeerJS error:', error);
            setConnectionStatus('Connection error');
        });

        setupLocalVideo();

        return () => {
            peer.disconnect();
            peer.destroy();
        };
    }, [userId]);

    const setupLocalVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error('Failed to get local media stream:', err);
        }
    };

    const handleIncomingCall = (call: Peer.MediaConnection) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                call.answer(stream);
                call.on('stream', (remoteStream) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                    }
                });
            })
            .catch(err => console.error('Failed to get media stream:', err));
    };

    const startCall = () => {
        if (!remotePeerId) {
            alert('Please enter a remote peer ID');
            return;
        }

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                const call = peerRef.current?.call(remotePeerId, stream);
                call?.on('stream', (remoteStream) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                    }
                });
                setConnectionStatus('Calling...');
            })
            .catch(err => console.error('Failed to get media stream:', err));
    };

    return (
        <div className="video-call-container">
            <h2>Video Call</h2>
            <p>Connection Status: {connectionStatus}</p>
            <div className="video-streams">
                <video ref={localVideoRef} autoPlay muted playsInline className="local-video" />
                <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
            </div>
            <div className="controls">
                <input
                    type="text"
                    value={remotePeerId}
                    onChange={(e) => setRemotePeerId(e.target.value)}
                    placeholder="Enter remote peer ID"
                />
                <button onClick={startCall}>Start Call</button>
            </div>
        </div>
    );
};

export default VideoCall;