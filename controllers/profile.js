import { nanoid } from "nanoid";

import prisma from "../prisma/client.js";
import s3 from "../config/s3.js";

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { ...req.body },
    });

    res.status(200).json({ success: true, message: "Your information has been updated!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    const { userId } = req.params;
    const { photo } = req.body;

    // Upload profile photo to S3
    const fileName = nanoid();
    const data = Buffer.from(photo.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Body: data,
      Key: "profile-photos/" + fileName,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    };

    await s3.upload(params).promise();

    // Store the profile photo file name to the database
    await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        profile_photo: fileName,
      },
    });

    res.status(200).json({ success: true, data: { message: "Your new profile photo has been set!", photo_key: fileName } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        fullname: true,
        username: true,
        email: true,
        profile_photo: true,
        about: true,
        contact_telegram: true,
        contact_messenger: true,
        contact_whatsapp: true,
      },
    });

    if (!user) return res.status(404).json({ success: false, message: "User with the given ID does not exist!" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProfilePosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { id } = req.user;

    const posts = await prisma.post.findMany({
      where: {
        user_id: parseInt(userId),
      },
      select: {
        id: true,
        description: true,
        is_public: true,
        latitude: true,
        longitude: true,
        views: true,
        created_at: true,
        user: {
          select: {
            fullname: true,
            profile_photo: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        comments: {
          select: {
            id: true,
            text: true,
            created_at: true,
            user: {
              select: {
                id: true,
                fullname: true,
              },
            },
          },
        },
        likes: {
          select: {
            user_id: true,
          },
        },
        photos: {
          select: {
            photo_key: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: posts.map((post) => {
        const postUsersLiked = post.likes.map((post) => post.user_id);

        delete post.likes;

        return {
          ...post,
          liked: postUsersLiked.includes(id),
        };
      }),
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { id } = req.user;

    // Check if user is a connection
    const isConnection = await prisma.connection.findFirst({
      where: {
        OR: [
          {
            user1_id: {
              equals: parseInt(userId),
            },
            user2_id: {
              equals: id,
            },
          },
          {
            user2_id: {
              equals: parseInt(userId),
            },
            user1_id: {
              equals: id,
            },
          },
        ],
        accepted: true,
      },
    });

    // Get mutual connections
    const mutualConnections = await prisma.$queryRaw`
    SELECT u.id, u.profile_photo FROM user u WHERE u.id IN (
      SELECT UserAConnections.id FROM (
        SELECT user2_id id FROM connection WHERE user1_id = ${userId} UNION 
        SELECT user1_id id FROM connection WHERE user2_id = ${userId}
     ) AS UserAConnections 
     JOIN  (
       SELECT user2_id id FROM connection WHERE user1_id = ${id} UNION 
       SELECT user1_id id FROM connection WHERE user2_id = ${id}
     ) AS UserBConnections 
     ON  UserAConnections.id = UserBConnections.id JOIN user ON user.id = UserAConnections.id
    )
     `;

    // If is connection, return all user's information
    if (isConnection) {
      // Get user information
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(userId),
        },
        select: {
          id: true,
          fullname: true,
          username: true,
          profile_photo: true,
          about: true,
          contact_telegram: true,
          contact_messenger: true,
          contact_whatsapp: true,
        },
      });

      // Get user's posts
      const posts = await prisma.post.findMany({
        where: {
          user_id: parseInt(userId),
        },
        select: {
          id: true,
          description: true,
          is_public: true,
          latitude: true,
          longitude: true,
          views: true,
          created_at: true,
          user: {
            select: {
              fullname: true,
              profile_photo: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
          comments: {
            select: {
              id: true,
              text: true,
              created_at: true,
              user: {
                select: {
                  id: true,
                  fullname: true,
                },
              },
            },
          },
          photos: {
            select: {
              photo_key: true,
            },
          },
        },
      });
      return res.status(200).json({ success: true, data: { user, mutualConnections, posts, connected: true } });
    }

    // If user is not connection, return restricted amount of information for that user
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
      select: {
        id: true,
        fullname: true,
        username: true,
        profile_photo: true,
        about: true,
      },
    });

    const requestSent = await prisma.connection.findFirst({
      where: {
        OR: [
          {
            user1_id: {
              equals: parseInt(userId),
            },
            user2_id: {
              equals: id,
            },
          },
          {
            user2_id: {
              equals: parseInt(userId),
            },
            user1_id: {
              equals: id,
            },
          },
        ],
      },
    });

    res.status(200).json({ success: true, data: { user, mutualConnections, requestSent: requestSent ? true : false, connected: false } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
