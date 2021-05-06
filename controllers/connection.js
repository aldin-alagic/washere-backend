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

    const data = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        connections1: {
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
          },
        },
        connections2: {
          select: {
            id: true,
            created_at: true,
            accepted_at: true,
            user1: {
              select: {
                id: true,
                fullname: true,
                username: true,
                profile_photo: true,
              },
            },
          },
        },
      },
    });

    // Format the response to make it prettier
    const connections = data.connections1
      .map((c) => ({ ...c, user: c.user2, user2: undefined }))
      .concat(data.connections2.map((c) => ({ ...c, user: c.user1, user1: undefined })));

    res.status(200).json({ success: true, data: connections });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
