import {Router} from 'express'
import clientController from '../controllers/client.controller.js'
import { authenticateToken, authorizeRole, validateSchema } from '../middleware/auth.middleware.js'
import { clientSchema } from '../schemas/validation.schemas.js'

const router = Router()
// Rutas protegidas que requieren autenticación
router.use(authenticateToken)

/**
 * @swagger
 * /clients:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Obtener todos los clientes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida exitosamente
 *       401:
 *         description: No autorizado
 */
router.get('/', clientController.getClients)

/**
 * @swagger
 * /clients:
 *   post:
 *     tags:
 *       - Clientes
 *     summary: Crear un nuevo cliente
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
 *               - email
 *               - phone
 *               - address
 *               - notes
 *               - customPricing:
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               notes:
 *                 type: string
 *               customPricing:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post('/', authorizeRole(['admin']), validateSchema(clientSchema), clientController.createClient)

export default router