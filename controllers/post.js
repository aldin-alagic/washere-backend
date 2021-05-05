import prisma from "../prisma/client.js";
import { nanoid } from "nanoid";

import s3 from "../config/s3.js";

export const newPost = async (req, res) => {
  try {
    const { description, is_public, latitude, longitude, photos } = req.body;
    const hashtags = description.match(/#\S+/g) || [];
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

    // Store hashtags to database
    await prisma.post.update({
      where: { id: post.id },
      data: {
        post_tags: {
          create: hashtags.map((hashtag) => ({ tag: hashtag.substring(1) })),
        },
      },
    });

    res.status(200).json({ success: true, message: "Post successfully created!" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Unable to create a new post! Please check your input." });
  }
};

export const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { id } = req.user;

    let post = await prisma.post.findUnique({
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
        _count: {
          select: {
            comments: true,
            likes: true,
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
        post_tags: {
          select: {
            tag: true,
          },
        },
      },
    });

    if (!post) return res.status(404).json({ success: false, message: "Post with the given ID does not exist!" });

    const postUsersLiked = post.likes.map((post) => post.user_id);
    delete post.likes;
    post = { ...post, liked: postUsersLiked.includes(id) };

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPostsByTag = async (req, res) => {
  try {
    const { number, lastPostId, query } = req.query;
    const { id } = req.user;

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
        post_tags: {
          some: { tag: { contains: query } },
        },
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
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        likes: {
          select: {
            user_id: true,
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
        post_tags: {
          select: {
            tag: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!posts) return res.status(404).json({ success: false, message: "No posts match the given search query!" });

    res.status(200).json({
      success: true,
      data: {
        posts: posts.map((post) => {
          const postUsersLiked = post.likes.map((post) => post.user_id);

          delete post.likes;

          return {
            ...post,
            liked: postUsersLiked.includes(id),
          };
        }),
        lastPostId: posts[posts.length - 1]?.id || lastPostId,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const { id: userId } = req.user;

    // Add new comment
    await prisma.comment.create({
      data: {
        user_id: userId,
        post_id: parseInt(postId),
        text,
      },
    });

    // Fetch all comments for this post
    const data = await prisma.post.findUnique({
      where: {
        id: parseInt(postId),
      },
      select: {
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
      },
    });

    res.status(200).json({ success: true, message: "Comment added!", data });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = req.user;

    // Check if user already liked the post
    const like = await prisma.like.findFirst({
      where: {
        post_id: parseInt(postId),
        user_id: parseInt(user.id),
      },
      select: {
        id: true,
      },
    });

    // Like the post if it's not already liked, otherwise remove the like
    if (!like) {
      await prisma.like.create({
        data: {
          user_id: user.id,
          post_id: parseInt(postId),
        },
      });
    } else {
      await prisma.like.delete({
        where: {
          id: like.id,
        },
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Post like status has successfully been toggled!", data: { post_id: parseInt(postId) } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
