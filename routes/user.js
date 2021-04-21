import { Router } from "express";
const router = Router();

import * as userController from "../controllers/user.js";
import auth from "../middleware/auth.js";

/**
 * @swagger
 * /user:
 *  post:
 *    tags:
 *    - "user"
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
 *    - "user"
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
 *    - "user"
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
 *    - "user"
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
 *    - "user"
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
 * /user/{userId}:
 *  patch:
 *    tags:
 *    - "user"
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
 *    - "user"
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
 * /user/{userId}:
 *  get:
 *    tags:
 *    - "user"
 *    summary: Get all information for the given user
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
 *                  description: ID of the user who posted the comment
 *                fullname:
 *                  type: string
 *                  description: Full name of the user who posted the comment
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

router.get("/:userId", auth, userController.getUser);

export default router;
