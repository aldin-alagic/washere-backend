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

  // Send the new post
  socket.emit("new post", post);
};
