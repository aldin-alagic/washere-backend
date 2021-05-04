import { Router } from "express";
const router = Router();

import * as userController from "../controllers/user.js";
import auth from "../middleware/auth.js";

/**
 * @swagger
 * /user:
 *  post:
 *    tags:
 *    - "authentication"
 *    summary: Register a new user
 *    parameters:
 *    - name: "body"
 *      in: "body"
 *      description: "User's information"
 *      schema:
 *        type: "object"
 *        properties:
 *          role_id:
 *            type: "number"
 *            description: User's role (administrator etc.)
 *          fullname:
 *            type: "string"
 *          username:
 *            type: "string"
 *          email:
 *            type: "string"
 *          password:
 *            type: "string"
 *          newsletter:
 *            type: boolean
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
 *              default: You have been successfully registered!
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

router.post("/", userController.register);

/**
 * @swagger
 * /user/login:
 *  post:
 *    tags:
 *    - "authentication"
 *    summary: Login with user credentials
 *    parameters:
 *    - name: "body"
 *      in: "body"
 *      description: "User's information"
 *      schema:
 *        type: "object"
 *        properties:
 *          email:
 *            type: "string"
 *          password:
 *            type: "string"
 *    responses:
 *      '200':
 *        description: A successful response
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: true
 *            token:
 *              type: string
 *            message:
 *              type: string
 *              default: You have been successfully logged in!
 *
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

router.post("/login", userController.login);

/**
 * @swagger
 * /user/reset-code:
 *  post:
 *    tags:
 *    - "authentication"
 *    summary: Request a reset code for password reset process
 *    parameters:
 *    - name: "body"
 *      in: "body"
 *      description: "User's email"
 *      schema:
 *        type: "object"
 *        properties:
 *          email:
 *            type: "string"
 *    responses:
 *      '200':
 *        description: A successful response, denoting that the reset code has been successfully sent to user's email (email sent back in response)
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: true
 *            data:
 *              type: integer
 *            message:
 *              type: string
 *              default: Reset code has been succesfully sent!
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

router.post("/reset-code", userController.resetCode);

/**
 * @swagger
 * /user/verify-reset-code:
 *  post:
 *    tags:
 *    - "authentication"
 *    summary: Verify reset code in password reset process
 *    parameters:
 *    - name: "body"
 *      in: "body"
 *      description: "Reset code"
 *      schema:
 *        type: "object"
 *        properties:
 *          resetCode:
 *            type: "string"
 *            description: User's password reset code that has been e-mailed to them
 *    responses:
 *      '200':
 *        description: A successful response, denoting that the reset code has been successfully verified (also sent back in response)
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: true
 *            data:
 *              type: integer
 *            message:
 *              type: string
 *              default: Reset code has been succesfully verified!
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

router.post("/verify-reset-code", userController.verifyResetCode);

/**
 * @swagger
 * /user/reset-password:
 *  post:
 *    tags:
 *    - "authentication"
 *    summary: Reset user's password using reset code and new password
 *    parameters:
 *    - name: "body"
 *      in: "body"
 *      description: "Reset code"
 *      schema:
 *        type: "object"
 *        properties:
 *          resetCode:
 *            type: "string"
 *            description: Password reset code unique to the user resetting the password
 *          password:
 *            type: "string"
 *            description: User's new password
 *    responses:
 *      '200':
 *        description: A successful response, denoting that the user's password has been successfully reset
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: true
 *            message:
 *              type: string
 *              default: Your password has been successfully reset!
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

router.post("/reset-password", userController.resetPassword);

/**
 * @swagger
 * /user/connections:
 *  get:
 *    tags:
 *    - "connections"
 *    summary: Get all connections for the user that is currently signed in
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      '200':
 *        description: A successful response, with array of user's connections
 *        schema:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              id:
 *                type: number
 *                description: Connection ID
 *              created_at:
 *                type: string
 *                format: date-time
 *                description: Date and time when the connection request has been sent
 *              accepted_at:
 *                type: string
 *                format: date-time
 *                description: Date and time when the connection request has been accepted
 *              user:
 *                type: object
 *                properties:
 *                  id:
 *                    type: number
 *                    description: User ID
 *                  fullname:
 *                    type: string
 *                    description: User's full name
 *                  username:
 *                    type: string
 *                    description: User's username
 *                  profile_photo:
 *                    type: string
 *                    description: AWS S3 file key to the profile photo of the user who made the post
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

router.get("/connections", auth, userController.getConnections);

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

router.patch("/:userId", userController.updateProfile);

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

router.post("/:userId/profile-photo", userController.uploadProfilePhoto);

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
 *                    contact_telegram:
 *                      type: string
 *                      description: Telegram contact information
 *                    contact_messenger:
 *                      type: string
 *                      description: Messenger contact information
 *                    contact_whatsapp:
 *                      type: string
 *                      description: WhatsApp contact information
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

router.get("/profile", auth, userController.getMyProfile);

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
 *                    contact_telegram:
 *                      type: string
 *                      description: Telegram contact information
 *                    contact_messenger:
 *                      type: string
 *                      description: Messenger contact information
 *                    contact_whatsapp:
 *                      type: string
 *                      description: WhatsApp contact information
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

router.get("/:userId/profile", auth, userController.getProfile);

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

router.get("/:userId/feed", auth, userController.getFeed);

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

router.get("/:userId/feed/filtered", auth, userController.getFeedFiltered);

/**
 * @swagger
 * /user/{userId}/request-connection:
 *  post:
 *    tags:
 *    - "connections"
 *    summary: Sends connection request to a user
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "User ID of the person you want to send the connection request to"
 *    responses:
 *      '200':
 *        description: A successful response, denoting that the connection request has been successfully sent
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
 *                  default: Connection request sent!
 *      '400':
 *        description: When the connection request has already been sent to that persons
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: false
 *            message:
 *              type: string
 *              default: You already sent connection request to this user!
 */

router.post("/:userId/request-connection", auth, userController.requestConnection);

/**
 * @swagger
 * /user/{userId}/accept-connection:
 *  post:
 *    tags:
 *    - "connections"
 *    summary: Accepts a received connection request from a user
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "User ID of the person whose connection request you want to accept"
 *    responses:
 *      '200':
 *        description: A successful response, denoting that the connection request has been successfully accepted
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
 *                  default: You are now connected!
 *      '400':
 *        description: When the connection request has already been accepted
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: false
 *            message:
 *              type: string
 *              default: You have already accepted the request!
 *      '404':
 *        description: When the connection request from the given user does not exist
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: false
 *            message:
 *              type: string
 *              default: Connection request does not exist!
 */

router.post("/:userId/accept-connection", auth, userController.acceptConnection);

export default router;
