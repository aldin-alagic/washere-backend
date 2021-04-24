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

    if (!people || people.length === 0) return res.status(404).json({ success: false, message: "No people match the given search query!" });

    res.status(200).json({ success: true, data: people });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
