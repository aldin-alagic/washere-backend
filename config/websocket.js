import jwt from "jsonwebtoken";
import { Server } from "socket.io";

export let socket;

export const create = (server) => {
  socket = new Server(server);

  // Check user authentication
  socket.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!jwt.verify(token, process.env.JWT_SECRET)) {
      next(new Error("Authentication error"));
    } else {
      next();
    }
  });

  return socket;
};
