import { Router } from "express";
const router = Router();

import auth from "../middleware/auth.js";
import user from "./user.js";
import post from "./post.js";
import search from "./search.js";

router.use("/user", user);
router.use("/post", auth, post);
router.use("/search", auth, search);

export default router;
