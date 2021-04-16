import { create } from "../config/websocket.js";
import fetchNearMe from "./fetchNearMe.js";

const wss = (server) => {
  // TODO: authentication using JWT
  create(server).on("connect", (socket) => {
    // When user sends message for fetching posts on the Near Me screen
    socket.on("fetch near me", (data) => fetchNearMe(data, socket));
  });
};

export default wss;
