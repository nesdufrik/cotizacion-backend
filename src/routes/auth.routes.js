import express from 'express'
const router = express.Router()
import authController from '../controllers/auth.controller.js'
import {
	authenticateToken,
	authorizeRole,
	validateSchema,
} from '../middleware/auth.middleware.js'
import {
	userRegisterSchema,
	userLoginSchema,
} from '../schemas/validation.schemas.js'

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Registrar un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
	'/register',
	validateSchema(userRegisterSchema),
	authController.register
)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', validateSchema(userLoginSchema), authController.login)

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     tags:
 *       - Autenticación
 *     summary: Obtener perfil del usuario actual
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *       401:
 *         description: No autorizado
 */
router.get('/profile', authenticateToken, authController.getProfile)

/**
 * @swagger
 * /auth/users/{userId}/role:
 *   patch:
 *     tags:
 *       - Autenticación
 *     summary: Actualizar rol de usuario (solo admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.patch(
	'/users/:userId/role',
	authenticateToken,
	authorizeRole(['admin']),
	authController.updateRole
)

export default router
