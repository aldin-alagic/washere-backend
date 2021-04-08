import prisma from "../prisma/client.js";

const newPost = async (req, res) => {
  const { description, is_public, latitude, longitude } = req.body;
  const user = req.user;
  try {
    await prisma.post.create({
      data: {
        user_id: user.id,
        description,
        is_public,
        latitude,
        longitude,
      },
    });
    res.status(200).json({ success: true, message: "Post successfully created!" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Unable to create a new post! Please check your input." });
  }
};

export { newPost };
