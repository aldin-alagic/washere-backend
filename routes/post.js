import { Router } from "express";
const router = Router();

import { newPost } from "../controllers/post.js";

/**
 * @swagger
 * /post:
 *  post:
 *    tags:
 *    - "post"
 *    summary: Submit a new post
 *    parameters:
 *    - in: header
 *      name: Bearer
 *      description: User token
 *    - name: "body"
 *      in: "body"
 *      description: "New post information"
 *      schema:
 *        type: "object"
 *        properties:
 *          description:
 *            type: "string"
 *            description: Post text that the end user enters
 *          is_public:
 *            type: boolean
 *            description: Whether the post is public or not
 *          latitude:
 *            type: "number"
 *            description: In format XX.XXXXXX (additional decimal digits are truncated)
 *          longitude:
 *            type: "number"
 *            description: In format (X)XX.XXXXXX (same as latitude, but longitude can have three signficant digits)
 *    responses:
 *      '200':
 *        description: A successful response, denoting that the post has been successfully created.
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: true
 *            message:
 *              type: string
 *              default: Post successfully created!
 *      '400':
 *        description: An unsuccesful response
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: false
 *            message:
 *              type: string
 */

router.post("/", newPost);

export default router;
