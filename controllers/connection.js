import prisma from "../prisma/client.js";

export const requestConnection = async (req, res) => {
  try {
    const { userId } = req.params;
    const { id } = req.user;

    // Check if connection or connection request already exists
    const exists = await prisma.connection.findFirst({
      where: {
        user1_id: id,
        user2_id: parseInt(userId),
      },
    });

    if (exists) return res.status(400).json({ success: false, message: "You already sent connection request to this user!" });

    // Store the connection request
    await prisma.connection.create({
      data: {
        user1_id: id,
        user2_id: parseInt(userId),
      },
    });

    res.status(200).json({ success: true, message: "Connection request sent!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const acceptConnection = async (req, res) => {
  try {
    const { userId } = req.params;
    const { id } = req.user;

    // Update connection in the database
    const connection = await prisma.connection.findFirst({
      where: {
        user1_id: parseInt(userId),
        user2_id: id,
      },
    });

    // Check if connection request exists
    if (!connection) return res.status(404).json({ success: false, message: "Connection request does not exist!" });

    // Check if connection request is already accepted
    if (connection.accepted) return res.status(400).json({ success: false, message: "You have already accepted the request!" });

    // Update connection in the database
    await prisma.connection.update({
      where: {
        id: connection.id,
      },
      data: {
        accepted: true,
        accepted_at: Date.now(),
      },
    });

    await res.status(200).json({ success: true, message: "You are now connected!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getConnections = async (req, res) => {
  try {
    const { id } = req.user;

    const connections = await prisma.connection.findMany({
      where: {
        accepted: true,
        OR: [
          {
            user1_id: id,
          },
          {
            user2_id: id,
          },
        ],
      },
      select: {
        id: true,
        created_at: true,
        accepted_at: true,
        user2: {
          select: {
            id: true,
            fullname: true,
            username: true,
            profile_photo: true,
          },
        },
        user1: {
          select: {
            id: true,
            fullname: true,
            username: true,
            profile_photo: true,
          },
        },
      },
    });

    const data = connections.map((connection) => {
      if (connection.user1.id == id) {
        connection.user = connection.user2;

        delete connection.user1;
        delete connection.user2;

        return connection;
      } else {
        connection.user = connection.user1;

        delete connection.user2;
        delete connection.user1;

        return connection;
      }
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
