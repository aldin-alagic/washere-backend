import { Router } from "express";
const router = Router();

import * as profileController from "../controllers/profile.js";

/**
 * @swagger
 * /user/{userId}:
 *  patch:
 *    tags:
 *    - "profile"
 *    summary: Update user profile information
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *    - name: "body"
 *      in: "body"
 *      description: "User's information. At least one property should be passed"
 *      schema:
 *        type: "object"
 *        properties:
 *          about:
 *            type: "string"
 *            description: General information about the user
 *          country:
 *            type: "string"
 *            description: ISO 3166-1 alpha-3 code of the user's country
 *          place:
 *            type: "string"
 *            description: User's residence
 *          contact_telegram:
 *            type: "string"
 *            description: Contact number for Telegram
 *          contact_messenger:
 *            type: "string"
 *            description: Contact number for Facebook Messenger
 *          contact_whatsapp:
 *            type: "string"
 *            description: Contact number for WhatsApp
 *    responses:
 *      '200':
 *        description: A successful response
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: true
 *            message:
 *              type: string
 *              default: Your information has been updated!
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
 *
 */

router.patch("/:userId", profileController.updateProfile);

/**
 * @swagger
 * /user/{userId}/profile-photo:
 *  post:
 *    tags:
 *    - "profile"
 *    consumes:
 *      - multipart/form-data
 *    summary: Uploads user's profile photo
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "User ID"
 *    - name: "photo"
 *      in: "body"
 *      schema:
 *        type: "object"
 *        properties:
 *          photo:
 *            type: "string"
 *            description: Profile photo in Base64 format
 *    responses:
 *      '200':
 *        description: A successful response, denoting that the profile photo has been successfully uploaded
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: true
 *            data:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Your new profile photo has been set!
 *                photo_key:
 *                  type: string
 *                  description: Key under which the photo has been stored
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

router.post("/:userId/profile-photo", profileController.uploadProfilePhoto);

/**
 * @swagger
 * /user/profile:
 *  get:
 *    tags:
 *    - "profile"
 *    summary: Get profile information for the currently signed in user
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "User ID"
 *    responses:
 *      '200':
 *        description: A successful response, with information belonging to the specified user
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
 *                  description: ID of the user
 *                fullname:
 *                  type: string
 *                  description: User's full name
 *                email:
 *                  type: string
 *                  description: User's email address
 *                profile_photo:
 *                  type: string
 *                  description: AWS S3 file key to the profile photo of the user who made the post
 *                about:
 *                  type: string
 *                  description: About text
 *                contact_telegram:
 *                  type: string
 *                  description: Telegram contact information
 *                contact_messenger:
 *                  type: string
 *                  description: Messenger contact information
 *                contact_whatsapp:
 *                  type: string
 *                  description: WhatsApp contact information
 *      '404':
 *        description: User with the given ID does not exist
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: false
 *            message:
 *              type: string
 *              default: "User with the given ID does not exist!"
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

router.get("/profile", profileController.getMyProfile);

/**
 * @swagger
 * /user/{userId}/posts:
 *  get:
 *    tags:
 *    - "profile"
 *    summary: Get posts for the user that matches a given user ID
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *    - name: "userId"
 *      in: "query"
 *      required: true
 *      description: User ID to search for
 *    responses:
 *      '200':
 *        description: A successful response, with an array of posts that belong to the user matching the specified ID
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: true
 *            data:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: number
 *                    description: Post ID
 *                  description:
 *                    type: string
 *                    description: Post content
 *                  is_public:
 *                    type: boolean
 *                    description: Whether the post is public or not
 *                  latitude:
 *                    type: number
 *                    description: In format XX.XXXXXX (additional decimal digits are truncated)
 *                  longitude:
 *                    type: number
 *                    description: In format (X)XX.XXXXXX (same as latitude, but longitude can have three signficant digits)
 *                  views:
 *                    type: number
 *                    description: Number of users who have seen the post
 *                  created_at:
 *                    type: string
 *                    format: date-time
 *                    description: Date and time when the post was made
 *                  user:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: number
 *                        description: ID of the user who made the post
 *                      fullname:
 *                        type: string
 *                        description: Full name of the user who made the post
 *                      profile_photo:
 *                        type: string
 *                        description: AWS S3 key to the profile photo of the user who made the post
 *                  _count:
 *                     type: object
 *                     properties:
 *                      comments:
 *                        type: number
 *                        description: Number of comments on the post
 *                      likes:
 *                        type: number
 *                        description: Number of likes on the post
 *                  comments:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: number
 *                          description: ID of the user who made the post
 *                        text:
 *                          type: string
 *                          description: Full name of the user who made the post
 *                        created_at:
 *                          type: string
 *                          format: date-time
 *                          description: Date and time when the comment was made
 *                        user:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: number
 *                              description: ID of the user who posted the comment
 *                            fullname:
 *                              type: string
 *                              description: Full name of the user who posted the comment
 *                  liked:
 *                    type: boolean
 *                    description: Whether the post has been liked by the user who sent the request
 *                  post_photos:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        photo_key:
 *                          type: string
 *                          description: AWS S3 key of the post photo
 *                  post_tags:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        tag:
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

router.get("/:userId/posts", profileController.getProfilePosts);

/**
 * @swagger
 * /user/{userId}/profile:
 *  get:
 *    tags:
 *    - "profile"
 *    summary: Get profile information for the given user
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "User ID"
 *    responses:
 *      '200':
 *        description: A successful response, with information belonging to the specified user
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: true
 *            data:
 *              type: object
 *              properties:
 *                user:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: number
 *                      description: ID of the user who posted the comment
 *                    fullname:
 *                      type: string
 *                      description: Full name of the user who posted the comment
 *                    profile_photo:
 *                      type: string
 *                      description: AWS S3 file key to the profile photo of the user who made the post
 *                    about:
 *                      type: string
 *                      description: About text
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
 *                       type: string
 *                       format: date-time
 *                       description: Date and time when the post was made
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
 *                              description: Text content of the comment
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
 *                              description: AWS S3 file key of the post photo
 *      '404':
 *        description: User with the given ID does not exist
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: false
 *            message:
 *              type: string
 *              default: "User with the given ID does not exist!"
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

router.get("/:userId/profile", profileController.getProfile);

export default router;
