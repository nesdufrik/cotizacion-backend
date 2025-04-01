import express from 'express'
const router = express.Router()
import quoteController from '../controllers/quote.controller.js'
import {
	authenticateToken,
	authorizeRole,
	validateSchema,
} from '../middleware/auth.middleware.js'
import {
	quoteSchema,
	emailQuoteProcessSchema,
} from '../schemas/validation.schemas.js'

/**
 * @swagger
 * /quotes:
 *   post:
 *     tags:
 *       - Cotizaciones
 *     summary: Crear una nueva cotización
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - services
 *             properties:
 *               customerId:
 *                 type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - service
 *                     - quantity
 *                   properties:
 *                     service:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                       minimum: 1
 *                     discount:
 *                       type: number
 *                       minimum: 0
 *                       maximum: 100
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cotización creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Cliente o servicio no encontrado
 */
router.post(
	'/',
	authenticateToken,
	validateSchema(quoteSchema),
	quoteController.createQuote
)

/**
 * @swagger
 * /quotes/{id}:
 *   get:
 *     tags:
 *       - Cotizaciones
 *     summary: Obtener una cotización por ID
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
 *         description: Cotización encontrada
 *       404:
 *         description: Cotización no encontrada
 */
router.get('/:id', authenticateToken, quoteController.getQuoteById)

/**
 * @swagger
 * /quotes/{id}/status:
 *   patch:
 *     tags:
 *       - Cotizaciones
 *     summary: Actualizar estado de una cotización
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected, expired]
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *       400:
 *         description: Estado inválido
 *       404:
 *         description: Cotización no encontrada
 */
router.patch(
	'/:id/status',
	authenticateToken,
	quoteController.updateQuoteStatus
)

/**
 * @swagger
 * /quotes/email-quotes/process:
 *   post:
 *     tags:
 *       - Cotizaciones
 *     summary: Procesar cotización desde email
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - sender
 *               - originalHtml
 *             properties:
 *               subject:
 *                 type: string
 *               sender:
 *                 type: string
 *                 format: email
 *               originalHtml:
 *                 type: string
 *     responses:
 *       201:
 *         description: Email procesado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
	'/email-quotes/process',
	authenticateToken,
	validateSchema(emailQuoteProcessSchema),
	quoteController.processEmailQuote
)

export default router
