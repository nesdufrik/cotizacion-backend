import { Router } from 'express'
import serviceController from '../controllers/service.controller.js'
import { authenticateToken, authorizeRole, validateSchema} from '../middleware/auth.middleware.js'

const router = Router()
// Rutas protegidas que requieren autenticación
router.use(authenticateToken)

/**
 * @swagger
 * /services:
 *   post:
 *     tags:
 *       - Servicios
 *     summary: Crear un nuevo servicio
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
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: string
 *                 description: ID de la categoría a la que pertenece el servicio
 *               scaledRateIndex:
 *                 type: number
 *                 minimum: 0
 *                 description: Índice de la tarifa escalonada a utilizar (si la categoría tiene precios escalonados)
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', serviceController.createService)

/**
 * @swagger
 * /services:
 *   get:
 *     tags:
 *       - Servicios
 *     summary: Obtener todos los servicios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de servicios
 *       401:
 *         description: No autorizado
 */
router.get('/', serviceController.getServices)

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     tags:
 *       - Servicios
 *     summary: Obtener un servicio por ID
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
 *         description: Servicio encontrado
 *       404:
 *         description: Servicio no encontrado
 */
router.get('/:id', serviceController.getServiceById)

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     tags:
 *       - Servicios
 *     summary: Actualizar un servicio
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
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: string
 *                 description: ID de la categoría a la que pertenece el servicio
 *               scaledRateIndex:
 *                 type: number
 *                 minimum: 0
 *                 description: Índice de la tarifa escalonada a utilizar (si la categoría tiene precios escalonados)
 *     responses:
 *       200:
 *         description: Servicio actualizado exitosamente
 *       404:
 *         description: Servicio no encontrado
 */
router.put('/:id', serviceController.updateService)

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     tags:
 *       - Servicios
 *     summary: Eliminar un servicio
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
 *         description: Servicio eliminado exitosamente
 *       404:
 *         description: Servicio no encontrado
 */
router.delete('/:id', serviceController.deleteService)

export default router