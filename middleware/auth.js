import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    let user = jwt.verify(token, process.env.JWT_SECRET);

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
