import { Router } from 'express'
import priceSheetController from '../controllers/priceSheet.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'

const router = Router()

// Rutas protegidas que requieren autenticación
router.use(authenticateToken)

/**
 * @swagger
 * /price-sheets:
 *   get:
 *     tags:
 *       - Hojas de Precios
 *     summary: Obtener todas las hojas de precios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de hojas de precios
 */
router.get('/', priceSheetController.getPriceSheets)

/**
 * @swagger
 * /price-sheets/{id}:
 *   get:
 *     tags:
 *       - Hojas de Precios
 *     summary: Obtener una hoja de precios por ID
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
 *         description: Hoja de precios encontrada
 *       404:
 *         description: Hoja de precios no encontrada
 */
router.get('/:id', priceSheetController.getPriceSheetById)

/**
 * @swagger
 * /price-sheets:
 *   post:
 *     tags:
 *       - Hojas de Precios
 *     summary: Crear una nueva hoja de precios
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
 *               - services
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     service:
 *                       type: string
 *                     price:
 *                       type: number
 *     responses:
 *       201:
 *         description: Hoja de precios creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', priceSheetController.createPriceSheet)

/**
 * @swagger
 * /price-sheets/{id}:
 *   put:
 *     tags:
 *       - Hojas de Precios
 *     summary: Actualizar una hoja de precios
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
 *               - services
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     service:
 *                       type: string
 *                     price:
 *                       type: number
 *     responses:
 *       200:
 *         description: Hoja de precios actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Hoja de precios no encontrada
 */
router.put('/:id', priceSheetController.updatePriceSheet)

/**
 * @swagger
 * /price-sheets/{id}:
 *   delete:
 *     tags:
 *       - Hojas de Precios
 *     summary: Eliminar una hoja de precios
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
 *         description: Hoja de precios eliminada exitosamente
 *       404:
 *         description: Hoja de precios no encontrada
 */
router.delete('/:id', priceSheetController.deletePriceSheet)

export default router