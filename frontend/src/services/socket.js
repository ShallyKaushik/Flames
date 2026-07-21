import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socket = null;

export const initializeSocket = () => {
  if (socket) return socket;

  const token = localStorage.getItem('flames_accessToken');
  if (!token) return null;

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
  });

  socket.on('connect', () => {
    console.log('Socket.IO Connected', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket.IO Connection Error:', err.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
