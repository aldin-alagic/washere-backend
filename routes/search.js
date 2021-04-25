import { Router } from "express";
const router = Router();

import * as searchController from "../controllers/search.js";

/**
 * @swagger
 * /search/people:
 *  post:
 *    tags:
 *    - "search"
 *    summary: Get people that match the given search query
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *    - name: "body"
 *      in: "body"
 *      schema:
 *        type: "object"
 *        properties:
 *          query:
 *            type: string
 *            description: Search query
 *    responses:
 *      '200':
 *        description: A successful response, with an array of users that match the search query
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: true
 *            data:
 *              type: array
 *              description: Array of users that match the search query
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: number
 *                    description: ID of the user
 *                  fullname:
 *                    type: string
 *                    description: Full name of the user
 *                  username:
 *                    type: string
 *                    description: Username of the user
 *                  profile_photo:
 *                    type: string
 *                    description: AWS S3 file key to the profile photo of the user
 *      '404':
 *        description: No people match the given search query
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: false
 *            message:
 *              type: string
 *              default: "No people match the given search query!"
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

router.post("/people", searchController.searchPeople);

/**
 * @swagger
 * /search/tags:
 *  post:
 *    tags:
 *    - "search"
 *    summary: Get posts that match the given search query (tag)
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *    - name: "body"
 *      in: "body"
 *      schema:
 *        type: "object"
 *        properties:
 *          query:
 *            type: string
 *            description: Search query
 *    responses:
 *      '200':
 *        description: A successful response, with an array of posts that match the search query
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: true
 *            data:
 *              type: object
 *              description: Array of posts that match the search query
 *              properties:
 *                posts:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: number
 *                        description: Post ID
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
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: number
 *                            description: ID of the user who made the post
 *                          fullname:
 *                            type: string
 *                            description: Full name of the user who made the post
 *                          profile_photo:
 *                            type: string
 *                            description: AWS S3 key to the profile photo of the user who made the post
 *                      comments:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: number
 *                              description: ID of the user who made the post
 *                            text:
 *                              type: string
 *                              description: Full name of the user who made the post
 *                            created_at:
 *                              type: string
 *                              format: date-time
 *                              description: Date and time when the comment was made
 *                            user:
 *                              type: object
 *                              properties:
 *                                id:
 *                                  type: number
 *                                  description: ID of the user who posted the comment
 *                                fullname:
 *                                  type: string
 *                                  description: Full name of the user who posted the comment
 *                      post_photos:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            photo_key:
 *                              type: string
 *                              description: AWS S3 key of the post photo
 *                      post_tags:
 *                        type: array
 *                        items:
 *                          type: string
 *                          description: Tag used in the post
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

router.post("/tags", searchController.searchTags);

export default router;
