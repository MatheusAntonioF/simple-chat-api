import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Server as SocketServer } from 'socket.io';
import httpServer from 'http';

import { appRoutes } from './routes/index.js';

const app = express();

const server = httpServer.createServer(app);

const io = new SocketServer(server, { cors: { origin: '*' } });

const connectedUsers = {};

io.on('connection', socket => {
  console.log(`⚡: ${socket.id} user just connected!`);

  const { userId: loggedUserId } = socket.handshake.auth;

  connectedUsers[loggedUserId] = socket.id;

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    delete connectedUsers[loggedUserId];
  });
});

app.use(bodyParser.json());

app.use((request, response, next) => {
  request.io = io;
  request.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());

app.use(appRoutes);

server.listen(3333, () => {
  console.log('start server');
});
