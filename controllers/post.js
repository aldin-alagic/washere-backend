import prisma from "../prisma/client.js";
import { nanoid } from "nanoid";

import s3 from "../config/s3.js";

export const newPost = async (req, res) => {
  try {
    const { description, is_public, latitude, longitude, photos } = req.body;
    const user = req.user;

    // Store the post in the database
    const post = await prisma.post.create({
      data: {
        user_id: user.id,
        description,
        is_public,
        latitude,
        longitude,
      },
    });

    // Upload photos to S3
    const photo_keys = [];
    for await (const photo of photos) {
      const fileName = nanoid();
      const data = Buffer.from(photo.replace(/^data:image\/\w+;base64,/, ""), "base64");
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Body: data,
        Key: "post-photos/" + fileName,
        ACL: "public-read",
        ContentEncoding: "base64",
        ContentType: "image/jpeg",
      };
      photo_keys.push(fileName);
      await s3.upload(params).promise();
    }

    // Store photo keys to database
    await prisma.post.update({
      where: { id: post.id },
      data: {
        photos: {
          create: photo_keys.map((photo) => ({ photo_key: photo })),
        },
      },
    });

    // TODO: send the post to Near Me screen using web socket

    res.status(200).json({ success: true, message: "Post successfully created!" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Unable to create a new post! Please check your input." });
  }
};

export const getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(postId),
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
            id: true,
            fullname: true,
            profile_photo: true,
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
        post_photos: {
          select: {
            photo_key: true,
          },
        },
      },
    });

    if (!post) return res.status(404).json({ success: false, message: "Post with the given ID does not exist!" });

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
