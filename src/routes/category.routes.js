import express from 'express'
const router = express.Router()
import categoryController from '../controllers/category.controller.js'
import {
	authenticateToken,
	authorizeRole,
	validateSchema,
} from '../middleware/auth.middleware.js'
import { categorySchema } from '../schemas/validation.schemas.js'

/**
 * @swagger
 * /categories:
 *   get:
 *     tags:
 *       - Categorías
 *     summary: Obtener todas las categorías
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateToken, categoryController.getCategories)

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags:
 *       - Categorías
 *     summary: Obtener una categoría por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 */
router.get('/:id', authenticateToken, categoryController.getCategoryById)

/**
 * @swagger
 * /categories:
 *   post:
 *     tags:
 *       - Categorías
 *     summary: Crear una nueva categoría
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
	'/',
	authenticateToken,
	authorizeRole(['admin']),
	validateSchema(categorySchema),
	categoryController.createCategory
)

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     tags:
 *       - Categorías
 *     summary: Actualizar una categoría
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *       404:
 *         description: Categoría no encontrada
 */
router.put(
	'/:id',
	authenticateToken,
	authorizeRole(['admin']),
	validateSchema(categorySchema),
	categoryController.updateCategory
)

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags:
 *       - Categorías
 *     summary: Eliminar una categoría
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente
 *       404:
 *         description: Categoría no encontrada
 */
router.delete(
	'/:id',
	authenticateToken,
	authorizeRole(['admin']),
	categoryController.deleteCategory
)

export default router
