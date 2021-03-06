import { Router } from "express";
const router = Router();

import * as postController from "../controllers/post.js";

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
 *            type: string
 *            description: Post text that the end user enters
 *          is_public:
 *            type: boolean
 *            description: Whether the post is public or not
 *          latitude:
 *            type: number
 *            description: In format XX.XXXXXX (additional decimal digits are truncated)
 *          longitude:
 *            type: number
 *            description: In format (X)XX.XXXXXX (same as latitude, but longitude can have three signficant digits)
 *          photos:
 *            type: array
 *            description: Array of photos in Base64 format
 *            items:
 *              type: string
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

router.post("/", postController.newPost);

/**
 * @swagger
 * /post/by-tag/:
 *  get:
 *    tags:
 *    - "post"
 *    summary: Get posts that contain the specified tag
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *    - name: "query"
 *      in: "query"
 *      required: true
 *      description: Tag to search for
 *    - name: "number"
 *      in: "query"
 *      required: true
 *      description: Number of posts to be fetched
 *    - name: "lastPostId"
 *      in: "query"
 *      required: false
 *      description: Post ID of the last post returned in previous invocation of this request
 *    responses:
 *      '200':
 *        description: A successful response, with an array of posts that contain the specified tag
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
 *                _count:
 *                   type: object
 *                   properties:
 *                    comments:
 *                      type: number
 *                      description: Number of comments on the post
 *                    likes:
 *                      type: number
 *                      description: Number of likes on the post
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
 *                liked:
 *                  type: boolean
 *                  description: Whether the post has been liked by the user who sent the request
 *                post_photos:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      photo_key:
 *                        type: string
 *                        description: AWS S3 key of the post photo
 *                post_tags:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      tag:
 *                        type: string
 *                        description: Tag used in the post
 *      '404':
 *        description: No posts match the given search query
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: false
 *            message:
 *              type: string
 *              default: "No posts match the given search query!"
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

router.get("/by-tag", postController.getPostsByTag);

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
 *                _count:
 *                   type: object
 *                   properties:
 *                    comments:
 *                      type: number
 *                      description: Number of comments on the post
 *                    likes:
 *                      type: number
 *                      description: Number of likes on the post
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
 *                liked:
 *                  type: boolean
 *                  description: Whether the post has been liked by the user who sent the request
 *                post_photos:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      photo_key:
 *                        type: string
 *                        description: AWS S3 key of the post photo
 *                post_tags:
 *                  type: array
 *                  items:
 *                    type: string
 *                    description: Tag used in the post
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

router.get("/:postId", postController.getPost);

/**
 * @swagger
 * /post/{postId}/comment:
 *  post:
 *    tags:
 *    - "post"
 *    summary: Add comment to a post
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *    - name: "postId"
 *      in: "path"
 *      description: "Post ID"
 *    - name: "body"
 *      in: "body"
 *      schema:
 *        type: object
 *        properties:
 *          text:
 *            type: string
 *            description: Comment text
 *    responses:
 *      '200':
 *        description: A successful response, denoting that the comment information has been successfully added. Returns an array of all comments for that post
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: true
 *            message:
 *              type: string
 *              default: "Comment added!"
 *            data:
 *              type: object
 *              properties:
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

router.post("/:postId/comment", postController.addComment);

/**
 * @swagger
 * /post/{postId}/toggle-like:
 *  post:
 *    tags:
 *    - "post"
 *    summary: Toggle post like status (like/dislike)
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *    - name: "postId"
 *      in: "path"
 *      description: "Post ID"
 *    responses:
 *      '200':
 *        description: A successful response, denoting that the post's like status has been modified
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: true
 *            message:
 *              type: string
 *              default: "Post like status has successfully been toggled!"
 *            data:
 *              type: object
 *              properties:
 *                post_id:
 *                  type: number
 *                  description: ID of the post that had its like status toggled
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

router.post("/:postId/toggle-like", postController.toggleLike);

export default router;
