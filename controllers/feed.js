import prisma from "../prisma/client.js";

export const getFeed = async (req, res) => {
  try {
    const { number, lastPostId } = req.query;
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

export const getFeedFiltered = async (req, res) => {
  try {
    const { number, lastPostId, filter } = req.query;
    const { id } = req.user;

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
      orderBy: {
        created_at: "desc",
      },
    });

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
