import { Router } from "express";
const router = Router();

import { register, login, resetCode, verifyResetCode, resetPassword } from "../controllers/user.js";

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

router.post("/", register);

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

router.post("/login", login);

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
router.post("/reset-code", resetCode);

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
router.post("/verify-reset-code", verifyResetCode);

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
 *          password:
 *            type: "string"
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
router.post("/reset-password", resetPassword);

export default router;
