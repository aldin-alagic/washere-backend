import { Router } from "express";
const router = Router();

import * as connectionController from "../controllers/connection.js";

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

router.post("/:userId/request-connection", connectionController.requestConnection);

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

router.post("/:userId/accept-connection", connectionController.acceptConnection);

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

router.get("/connections", connectionController.getConnections);

export default router;
