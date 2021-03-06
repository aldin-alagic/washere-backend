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
 *    summary: Get tags that match the given search query
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
 *        description: A successful response, with an array of tags that match the search query
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: true
 *            data:
 *              type: object
 *              properties:
 *                tags:
 *                  type: array
 *                  description: Array of tags used in the post
 *                  items:
 *                    type: object
 *                    properties:
 *                      post_tags_id:
 *                        type: string
 *                        description: Unique ID of the post tag
 *                      tag:
 *                        type: string
 *                        description: Tag used in the post
 *      '404':
 *        description: No tags match the given search query
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *              default: false
 *            message:
 *              type: string
 *              default: "No tags match the given search query!"
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
