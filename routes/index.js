import { Router } from "express";
const router = Router();

import auth from "../middleware/auth.js";
import user from "./user.js";
import connection from "./connection.js";
import post from "./post.js";
import search from "./search.js";
import feed from "./feed.js";
import profile from "./profile.js";

router.use("/user", user);
router.use("/user", auth, connection);
router.use("/user", auth, feed);
router.use("/user", auth, profile);
router.use("/post", auth, post);
router.use("/search", auth, search);

export default router;
