import prisma from "../prisma/client.js";

export const searchPeople = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) return res.status(200).json({ success: true, data: [] });

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

    if (!query) return res.status(200).json({ success: true, data: { tags: [] } });

    const tags = await prisma.post_tags.findMany({
      where: {
        tag: {
          contains: query,
        },
      },
      select: {
        post_tags_id: true,
        tag: true,
      },
    });

    if (tags.length === 0) return res.status(404).json({ success: false, message: "No tags match the given search query!" });

    res.status(200).json({ success: true, data: { tags } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
