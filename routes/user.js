import { Router } from "express";
const router = Router();

import * as userController from "../controllers/user.js";

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
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "User ID"
 *    - name: "photo"
 *      in: "body"
 *      schema:
 *          type: file
 *    responses:
 *      '200':
 *        description: A successful response, denoting that the profile photo has been successfully uploaded
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: true
 *            message:
 *              type: string
 *              default: Your new profile photo has been set!
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

export default router;
