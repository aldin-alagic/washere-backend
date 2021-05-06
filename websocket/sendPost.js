import prisma from "../prisma/client.js";
import { socket } from "../config/websocket.js";

export default async (postId) => {
  // Query data for that post ID
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(postId),
    },
    include: {
      user: {
        select: {
          fullname: true,
          profile_photo: true,
        },
      },
    },
  });

  // Send the new post to the users that are viewing that region on the map
  const sockets = await socket.fetchSockets();
  for (const socket of sockets) {
    const { locationFrom, locationTo } = socket.data;

    if (!(post.longitude >= locationTo.longitude && post.longitude <= locationFrom.longitude)) continue;
    if (!(post.latitude >= locationFrom.latitude && post.latitude <= locationTo.latitude)) continue;

    socket.emit("new post", post);
  }
};
