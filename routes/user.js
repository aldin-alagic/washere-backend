import { Router } from "express";
const router = Router();

import { getAll, create } from "../controllers/user.js";

/**
 * @swagger
 * /:
 *  get:
 *    tags:
 *    - "/user/"
 *    summary: Get all users
 *    responses:
 *      '200':
 *        description: All
 *      '400':
 *        description: An unsuccessful response
 */

router.get("/", getAll);

/**
 * @swagger
 * /register:
 *  post:
 *    tags:
 *    - "/user/"
 *    summary: Register a new user
 *    parameters:
 *    - name: "body"
 *      in: "body"
 *      description: "User's information"
 *      schema:
 *        type: "object"
 *        properties:
 *          firstname:
 *            type: "string"
 *          lastname:
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
 *      '400':
 *        description: An unsuccesful response
 */

router.post("/", create);

export default router;
