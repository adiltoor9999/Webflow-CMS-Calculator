import { io } from 'socket.io-client';

let socket;

export const initSocket = () => {
  try {
    socket = io('ws://localhost:3000/ws', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('WebSocket connection established');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket connection lost');
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      // Display an error message to the user
      setError('WebSocket connection failed. Please try again later.');
    });

    return socket;
  } catch (error) {
    console.error('Error establishing WebSocket connection:', error);
    // Display an error message to the user
    setError('Failed to establish WebSocket connection. Please try again later.');
    return null;
  }
};

const setError = (errorMessage) => {
  // Update the state to display the error message
  // For example, if you have an 'error' state variable:
  // setError(errorMessage);
};