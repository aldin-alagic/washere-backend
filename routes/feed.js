import { Router } from "express";
const router = Router();

import * as feedController from "../controllers/feed.js";
import auth from "../middleware/auth.js";

/**
 * @swagger
 * /user/{userId}/feed:
 *  get:
 *    tags:
 *    - "feed"
 *    summary: Get user's feed, sorted in descending order by creation date, with pagination support
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "User ID"
 *      required: true
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
 *        description: A successful response, with user's feed (array of posts)
 *        schema:
 *          type: object
 *          properties:
 *            data:
 *              type: object
 *              properties:
 *                posts:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                       type: number
 *                       description: Post ID
 *                      description:
 *                        type: string
 *                        description: Post content
 *                      is_public:
 *                        type: boolean
 *                        description: Whether the post is public or not
 *                      latitude:
 *                        type: number
 *                        description: In format XX.XXXXXX (additional decimal digits are truncated)
 *                      longitude:
 *                        type: number
 *                        description: In format (X)XX.XXXXXX (same as latitude, but longitude can have three signficant digits)
 *                      views:
 *                        type: number
 *                        description: Number of users who have seen the post
 *                      created_at:
 *                        type: string
 *                        format: date-time
 *                        description: Date and time when the post was made
 *                      user:
 *                         type: object
 *                         properties:
 *                          id:
 *                            type: number
 *                            description: User's ID
 *                          fullname:
 *                            type: string
 *                            description: Full name of the user that made the post
 *                          profile_photo:
 *                            type: string
 *                            description: AWS S3 file key to the profile photo of the user who made the post
 *                      _count:
 *                         type: object
 *                         properties:
 *                          comments:
 *                            type: number
 *                            description: Number of comments on the post
 *                          likes:
 *                            type: number
 *                            description: Number of likes on the post
 *                      liked:
 *                        type: boolean
 *                        description: Whether the post has been liked by the user who sent the request
 *                      photos:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            photo_key:
 *                              type: string
 *                              description: AWS S3 key of the post photo
 *                lastPostId:
 *                  type: number
 *                  description: ID of the last post that was fetched
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

router.get("/:userId/feed", auth, feedController.getFeed);

/**
 * @swagger
 * /user/{userId}/feed/filtered:
 *  get:
 *    tags:
 *    - "feed"
 *    summary: Get user's feed, filtered by provided filter, sorted in descending order by creation date, with pagination support
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "User ID"
 *      required: true
 *    - name: "number"
 *      in: "query"
 *      required: true
 *      description: Number of posts to be fetched
 *    - name: "lastPostId"
 *      in: "query"
 *      required: false
 *      description: Post ID of the last post returned in previous invocation of this request
 *    - name: "filter"
 *      in: "query"
 *      required: true
 *      description: Filter according to which posts be filtered (they will be filtered according to poster's fullname or post description)
 *    responses:
 *      '200':
 *        description: A successful response, with user's feed (array of posts)
 *        schema:
 *          type: object
 *          properties:
 *            data:
 *              type: object
 *              properties:
 *                posts:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                       type: number
 *                       description: Post ID
 *                      description:
 *                        type: string
 *                        description: Post content
 *                      is_public:
 *                        type: boolean
 *                        description: Whether the post is public or not
 *                      latitude:
 *                        type: number
 *                        description: In format XX.XXXXXX (additional decimal digits are truncated)
 *                      longitude:
 *                        type: number
 *                        description: In format (X)XX.XXXXXX (same as latitude, but longitude can have three signficant digits)
 *                      views:
 *                        type: number
 *                        description: Number of users who have seen the post
 *                      created_at:
 *                        type: string
 *                        format: date-time
 *                        description: Date and time when the post was made
 *                      user:
 *                         type: object
 *                         properties:
 *                          fullname:
 *                            type: string
 *                            description: Full name of the user that made the post
 *                          profile_photo:
 *                            type: string
 *                            description: AWS S3 file key to the profile photo of the user who made the post
 *                      _count:
 *                         type: object
 *                         properties:
 *                          comments:
 *                            type: number
 *                            description: Number of comments on the post
 *                          likes:
 *                            type: number
 *                            description: Number of likes on the post
 *                      liked:
 *                        type: boolean
 *                        description: Whether the post has been liked by the user who sent the request
 *                      photos:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            photo_key:
 *                              type: string
 *                              description: AWS S3 key of the post photo

 *                lastPostId:
 *                  type: number
 *                  description: ID of the last post that was fetched
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

router.get("/:userId/feed/filtered", auth, feedController.getFeedFiltered);

export default router;
