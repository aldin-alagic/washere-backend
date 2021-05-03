import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import { nanoid } from "nanoid";

import prisma from "../prisma/client.js";
import s3 from "../config/s3.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const register = async (req, res) => {
  try {
    const { password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the user in DB
    await prisma.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
      },
    });

    res.status(200).json({ success: true, message: "You have been successfully registered!" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Unable to register user! Please check your input." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password!" });

    // Check for matching passwords
    const matchingPassword = await bcrypt.compareSync(password, user.password);
    if (!matchingPassword) return res.status(401).json({ success: false, message: "Invalid email or password!" });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        fullname: user.fullname,
        premium: user.premium,
        profile_photo: user.profile_photo,
      },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      success: true,
      data: {
        token,
      },
      message: "You have been successfully logged in!",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetCode = async (req, res) => {
  try {
    const { email } = req.body;

    const resetCode = Math.floor(100000 + Math.random() * 900000);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error("You have entered an invalid e-mail address!");

    const codeTypeId = (await prisma.code_type.findUnique({ where: { name: "password_reset_code" } })).id;

    // Generate a password reset token
    await prisma.code.create({
      data: {
        code_type_id: codeTypeId,
        user_id: user.id,
        value: resetCode.toString(),
      },
    });

    const msg = {
      to: `${req.body.email}`,
      from: `nibblewashere38@gmail.com`,
      replyTo: "nibblewashere38@gmail.com",
      subject: "WasHere - Your password reset code",
      text: `Hello, you've recently requested a password reset. Please use this code in the application for verification before changing the password: ${resetCode} \n Enjoy!\nSincerely, WasHere team`,
      html: `<p>Hello, you've recently requested a password reset. Please use this code in the application for verification before changing the password: ${resetCode} <br> Enjoy!<br>Sincerely, WasHere team</p>`,
    };
    await sgMail.send(msg);

    res.status(200).json({ success: true, data: email, message: "Reset code has been succesfully sent!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyResetCode = async (req, res) => {
  try {
    const { resetCode } = req.body;

    const resetCodeDb = await prisma.code.findFirst({ where: { value: resetCode } });
    if (resetCodeDb == null) throw new Error("You have entered an invalid reset code!");

    res.status(200).json({ success: true, data: resetCode, message: "Reset code has been successfully verified!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password, resetCode } = req.body;

    const passwordResetCode = await prisma.code.findFirst({ where: { value: resetCode } });
    if (passwordResetCode == null) throw new Error("You have entered an invalid reset code!");

    await prisma.user.findUnique({ where: { id: passwordResetCode.user_id } });
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: passwordResetCode.user_id },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.code.deleteMany({ where: { user_id: passwordResetCode.user_id } });

    res.status(200).json({ success: true, message: "Your password has been successfully reset!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

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
        profile_photo: true,
        about: true,
        contact_telegram: true,
        contact_messenger: true,
        contact_whatsapp: true,
      },
    });

    if (!user) return res.status(404).json({ success: false, message: "User with the given ID does not exist!" });

    const posts = await prisma.post.findMany({
      where: {
        user_id: id,
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

    res.status(200).json({ success: true, data: { user, posts } });
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
      return res.status(200).json({ success: true, data: { user, posts, connected: true } });
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

export const getFeed = async (req, res) => {
  try {
    const { number, lastPostId } = req.query;

    const posts = await prisma.post.findMany({
      take: parseInt(number),
      ...(lastPostId && {
        skip: 1,
        cursor: {
          id: parseInt(lastPostId),
        },
      }),
      where: {
        is_public: true,
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
        photos: {
          select: {
            photo_key: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json({ success: true, data: { posts: posts, lastPostId: posts[posts.length - 1]?.id || lastPostId } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getFeedFiltered = async (req, res) => {
  try {
    const { number, lastPostId, filter } = req.query;

    if (!filter) throw new Error(`URL parameter "filter" hasn't been provided!`);

    const posts = await prisma.post.findMany({
      take: parseInt(number),
      ...(lastPostId && {
        skip: 1,
        cursor: {
          id: parseInt(lastPostId),
        },
      }),
      where: {
        is_public: true,
        OR: [
          {
            user: {
              fullname: {
                contains: filter,
              },
            },
          },
          {
            description: { contains: filter },
          },
        ],
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
        photos: {
          select: {
            photo_key: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json({ success: true, data: { posts: posts, lastPostId: posts[posts.length - 1]?.id || lastPostId } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

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
        accepted_at: new Date(),
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
