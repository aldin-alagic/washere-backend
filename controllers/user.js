import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

import prisma from "../prisma/client.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const register = async (req, res) => {
  try {
    const { password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the user in DB
    await prisma.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
      },
    });

    res.status(200).json({ success: true, message: "You have been successfully registered!" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Unable to register user! Please check your input." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

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
        id: user.id,
        email: user.email,
        username: user.username,
        fullname: user.fullname,
        premium: user.premium,
        profile_photo: user.profile_photo,
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
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetCode = async (req, res) => {
  try {
    const { email } = req.body;

    const resetCode = Math.floor(100000 + Math.random() * 900000);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error("You have entered an invalid e-mail address!");

    const codeTypeId = (await prisma.code_type.findUnique({ where: { name: "password_reset_code" } })).id;

    // Generate a password reset token
    await prisma.code.create({
      data: {
        code_type_id: codeTypeId,
        user_id: user.id,
        value: resetCode.toString(),
      },
    });

    const msg = {
      to: `${req.body.email}`,
      from: `nibblewashere38@gmail.com`,
      replyTo: "nibblewashere38@gmail.com",
      subject: "WasHere - Your password reset code",
      text: `Hello, you've recently requested a password reset. Please use this code in the application for verification before changing the password: ${resetCode} \n Enjoy!\nSincerely, WasHere team`,
      html: `<p>Hello, you've recently requested a password reset. Please use this code in the application for verification before changing the password: ${resetCode} <br> Enjoy!<br>Sincerely, WasHere team</p>`,
    };
    await sgMail.send(msg);

    res.status(200).json({ success: true, data: email, message: "Reset code has been succesfully sent!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyResetCode = async (req, res) => {
  try {
    const { resetCode } = req.body;

    const resetCodeDb = await prisma.code.findFirst({ where: { value: resetCode } });
    if (resetCodeDb == null) throw new Error("You have entered an invalid reset code!");

    res.status(200).json({ success: true, data: resetCode, message: "Reset code has been successfully verified!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password, resetCode } = req.body;

    const passwordResetCode = await prisma.code.findFirst({ where: { value: resetCode } });
    if (passwordResetCode == null) throw new Error("You have entered an invalid reset code!");

    await prisma.user.findUnique({ where: { id: passwordResetCode.user_id } });
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: passwordResetCode.user_id },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.code.deleteMany({ where: { user_id: passwordResetCode.user_id } });

    res.status(200).json({ success: true, message: "Your password has been successfully reset!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
