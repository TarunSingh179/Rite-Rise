import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export interface SocketServer extends HTTPServer {
  io?: SocketIOServer;
}

export const initSocket = (httpServer: SocketServer) => {
  if (httpServer.io) return httpServer.io;

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  httpServer.io = io;

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('join_room', (userId: string) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room`);
    });

    socket.on('send_message', (data) => {
      const { receiverId, message } = data;
      socket.to(`user_${receiverId}`).emit('receive_message', message);
    });

    socket.on('typing', (data) => {
      const { receiverId, senderId } = data;
      socket.to(`user_${receiverId}`).emit('user_typing', { senderId });
    });

    socket.on('stop_typing', (data) => {
      const { receiverId, senderId } = data;
      socket.to(`user_${receiverId}`).emit('user_stop_typing', { senderId });
    });

    socket.on('notification', (data) => {
      const { userId, notification } = data;
      socket.to(`user_${userId}`).emit('new_notification', notification);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};
