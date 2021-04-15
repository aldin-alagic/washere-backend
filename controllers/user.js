import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import { nanoid } from "nanoid";

import prisma from "../prisma/client.js";
import s3 from "../config/s3.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

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
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetCode = async (req, res) => {
  const email = req.body.email;

  try {
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
  const { resetCode } = req.body;

  try {
    const resetCodeDb = await prisma.code.findFirst({ where: { value: resetCode } });
    if (resetCodeDb == null) throw new Error("You have entered an invalid reset code!");

    res.status(200).json({ success: true, data: resetCode, message: "Reset code has been successfully verified!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { password, resetCode } = req.body;
  try {
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

export const uploadProfilePhoto = async (req, res) => {
  try {
    const { userId } = req.params;
    const { photo } = req.files;

    // Upload profile photo to S3
    const fileName = nanoid();

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Body: photo.data,
      Key: "profile-photos/" + fileName,
      ACL: "public-read",
      ContentType: "image/jpeg",
    };

    await s3.upload(params).promise();

    // Store the profile photo file name to the database
    await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        profile_photo: fileName,
      },
    });

    res.status(200).json({ success: true, message: "Your new profile photo has been set!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
