import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;
if (!SOCKET_URL) {
  console.error('NEXT_PUBLIC_API_URL is not set');
}

export const socket = io(SOCKET_URL || 'http://localhost:4000'); 