import { Router } from "express";
const router = Router();

import { newPost, getPost } from "../controllers/post.js";

/**
 * @swagger
 * /post:
 *  post:
 *    tags:
 *    - "post"
 *    summary: Submit a new post
 *    security:
 *    - bearerAuth: []
 *    parameters:
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

/**
 * @swagger
 * /post/{postId}:
 *  get:
 *    tags:
 *    - "post"
 *    summary: Get post information (description, comments etc.)
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *    - name: "postId"
 *      in: "path"
 *      description: "Post ID"
 *    responses:
 *      '200':
 *        description: A successful response, denoting that the post information has been successfully fetched
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: true
 *            data:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                  description: Post ID
 *                description:
 *                  type: string
 *                  description: Post content
 *                is_public:
 *                  type: boolean
 *                  description: Whether the post is public or not
 *                latitude:
 *                  type: number
 *                  description: In format XX.XXXXXX (additional decimal digits are truncated)
 *                longitude:
 *                  type: number
 *                  description: In format (X)XX.XXXXXX (same as latitude, but longitude can have three signficant digits)
 *                views:
 *                  type: number
 *                  description: Number of users who have seen the post
 *                created_at:
 *                  type: string
 *                  format: date-time
 *                  description: Date and time when the post was made
 *                user:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: number
 *                      description: ID of the user who made the post
 *                    fullname:
 *                      type: string
 *                      description: Full name of the user who made the post
 *                    profile_photo:
 *                      type: string
 *                      description: AWS S3 key to the profile photo of the user who made the post
 *                comments:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: number
 *                        description: ID of the user who made the post
 *                      text:
 *                        type: string
 *                        description: Full name of the user who made the post
 *                      created_at:
 *                        type: string
 *                        format: date-time
 *                        description: Date and time when the comment was made
 *                      user:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: number
 *                            description: ID of the user who posted the comment
 *                          fullname:
 *                            type: string
 *                            description: Full name of the user who posted the comment
 *                post_photos:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      photo_key:
 *                        type: string
 *                        description: AWS S3 key of the post photo
 *      '404':
 *        description: Post with the given ID does not exist
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: false
 *            message:
 *              type: string
 *              default: "Post with the given ID does not exist!"
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

router.get("/:postId", getPost);

export default router;
