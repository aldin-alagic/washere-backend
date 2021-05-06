import prisma from "../prisma/client.js";
import dayjs from "dayjs";

// Fetches all posts which location is within a region on the map which are made within the given time frame

export default async (data, socket) => {
  // Store the region the client is viewing on the map
  socket.data = data;

  // Query database for posts in that region
  const posts = await prisma.post.findMany({
    where: {
      is_public: true,
      longitude: {
        gte: data.locationTo.longitude,
        lte: data.locationFrom.longitude,
      },
      latitude: {
        gte: data.locationFrom.latitude,
        lte: data.locationTo.latitude,
      },
      created_at: {
        gte: dayjs.unix(data.time.from).format(),
        lte: dayjs.unix(data.time.to).format(),
      },
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

  // Send posts to socket client
  socket.emit("posts", posts);
};
