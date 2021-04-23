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

export default router;
