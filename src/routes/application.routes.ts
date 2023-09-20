/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: API endpoints for managing applications
 */

import { Router, Request, Response } from 'express';
import path from 'path';
import {
  getAllApplications,
  getSingleApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/application.controller';

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     tags: [Root]
 *     responses:
 *       200:
 *         description: Welcome message
 */
router.get('/', (req: Request, res: Response) => {
  const filePath = path.join(__dirname, '..', 'public', 'index.html');
  res.status(200).sendFile(filePath);
});

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Get a list of all applications
 *     tags: [Applications]
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.get('/applications', getAllApplications);

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Create a new application
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the application
 *               position:
 *                 type: string
 *                 description: The position of the application
 *               status:
 *                 type: string
 *                 description: The status of the application
 *     responses:
 *       201:
 *         description: Application created successfully
 *       400:
 *         description: Bad request, invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/applications', createApplication);

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: Get a single application by ID
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the application to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
router.get('/applications/:id', getSingleApplication);

/**
 * @swagger
 * /applications/{id}:
 *   put:
 *     summary: Update an application by ID
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the application to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the application
 *               position:
 *                 type: string
 *                 description: The updated position of the application
 *               status:
 *                 type: string
 *                 description: The updated status of the application
 *     responses:
 *       200:
 *         description: Application updated successfully
 *       404:
 *         description: Application not found
 *       400:
 *         description: Bad request, invalid input data
 *       500:
 *         description: Internal server error
 */
router.put('/applications/:id', updateApplication);

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: Delete an application by ID
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the application to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Application deleted successfully
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
router.delete('/applications/:id', deleteApplication);

export default router;
