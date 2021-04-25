import prisma from "../prisma/client.js";

export const searchPeople = async (req, res) => {
  try {
    const { query } = req.body;

    const people = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: query,
            },
          },
          {
            fullname: {
              contains: query,
            },
          },
        ],
      },
      select: {
        id: true,
        fullname: true,
        username: true,
        profile_photo: true,
      },
    });

    if (people.length === 0) return res.status(404).json({ success: false, message: "No people match the given search query!" });

    res.status(200).json({ success: true, data: people });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const searchTags = async (req, res) => {
  try {
    const { query } = req.body;

    const posts = await prisma.post.findMany({
      where: {
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
    });

    if (posts.length === 0) return res.status(404).json({ success: false, message: "No posts match the given search query!" });

    res.status(200).json({ success: true, data: { posts } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
