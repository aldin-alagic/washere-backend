import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    let user = jwt.verify(token, process.env.JWT_SECRET);
    user = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    req.user = user;
    req.token = token;
    next();
  } catch {
    res.status(400).json({
      success: false,
      message: "Authentication failure!",
    });
  }
};

export default auth;
