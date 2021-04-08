import { Router } from "express";
const router = Router();

import auth from "../middleware/auth.js";
import user from "./user.js";
import post from "./post.js";

router.use("/user", user);
router.use("/post", auth, post);

export default router;
