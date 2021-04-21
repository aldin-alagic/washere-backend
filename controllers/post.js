import prisma from "../prisma/client.js";

export const newPost = async (req, res) => {
  try {
    const { description, is_public, latitude, longitude } = req.body;
    const user = req.user;

    // Store the post in the database
    await prisma.post.create({
      data: {
        user_id: user.id,
        description,
        is_public,
        latitude,
        longitude,
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
