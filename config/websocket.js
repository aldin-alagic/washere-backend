import { Server } from "socket.io";

export let socket;

export const create = (server) => {
  socket = new Server(server);
  return socket;
};
