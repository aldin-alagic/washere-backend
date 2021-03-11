import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

const getAll = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
};

const register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await prisma.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
      },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
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
        email: user.email,
        username: user.username,
        fullname: user.fullname,
        premium: user.premium,
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
    res.status(400).json({ success: false, message: error });
  }
};

export { getAll, register, login };
