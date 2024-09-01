import { NextResponse } from 'next/server';
import { PeerServer } from 'peerjs';


// Set up a PeerJS server instance
const peerServer = PeerServer({ port: 9000, path: '/myapp' });

// Export a function to handle the server
export async function GET() {
    return NextResponse.json({ message: 'PeerJS server is running' });
}
