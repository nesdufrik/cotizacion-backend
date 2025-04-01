import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import {
	userRegisterSchema,
	userLoginSchema,
} from '../schemas/validation.schemas.js'

class AuthController {
	// Actualizar rol de usuario
	async updateRole(req, res) {
		try {
			const { userId } = req.params
			const { role } = req.body

			// Verificar que el rol sea válido
			if (!['admin', 'user'].includes(role)) {
				return res.status(400).json({
					status: 'error',
					message: 'Rol inválido',
				})
			}

			// Verificar que el usuario a actualizar existe
			const userToUpdate = await User.findById(userId)
			if (!userToUpdate) {
				return res.status(404).json({
					status: 'error',
					message: 'Usuario no encontrado',
				})
			}

			// Si se está cambiando a rol de usuario y es el último admin, no permitir
			if (role === 'user' && userToUpdate.role === 'admin') {
				const adminCount = await User.countDocuments({ role: 'admin' })
				if (adminCount <= 1) {
					return res.status(400).json({
						status: 'error',
						message: 'No se puede degradar al último administrador',
					})
				}
			}

			// Actualizar rol
			userToUpdate.role = role
			await userToUpdate.save()

			res.json({
				status: 'success',
				data: {
					user: {
						id: userToUpdate._id,
						name: userToUpdate.name,
						email: userToUpdate.email,
						role: userToUpdate.role,
					},
				},
			})
		} catch (error) {
			res.status(500).json({
				status: 'error',
				message: 'Error al actualizar el rol del usuario',
			})
		}
	}

	// Registro de usuario
	async register(req, res) {
		try {
			const validatedData = userRegisterSchema.parse(req.body)

			// Verificar si el usuario ya existe
			const existingUser = await User.findOne({ email: validatedData.email })
			if (existingUser) {
				return res.status(400).json({
					status: 'error',
					message: 'El email ya está registrado',
				})
			}

			// Verificar si se solicita rol de admin y si ya existe un admin
			const requestedRole = validatedData.role || 'user'
			if (requestedRole === 'admin') {
				const existingAdmin = await User.findOne({ role: 'admin' })
				if (existingAdmin) {
					validatedData.role = 'user' // Si ya existe un admin, asignar rol de usuario
				}
			}

			// Crear nuevo usuario
			const user = new User(validatedData)
			await user.save()

			// Generar token JWT
			const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
				expiresIn: process.env.JWT_EXPIRES_IN,
			})

			res.status(201).json({
				status: 'success',
				data: {
					user: {
						id: user._id,
						name: user.name,
						email: user.email,
						role: user.role,
					},
					token,
				},
			})
		} catch (error) {
			if (error.name === 'ZodError') {
				return res.status(400).json({
					status: 'error',
					message: 'Error de validación',
					errors: error.errors,
				})
			}
			res.status(500).json({
				status: 'error',
				message: 'Error al registrar usuario',
			})
		}
	}

	// Login de usuario
	async login(req, res) {
		try {
			const validatedData = userLoginSchema.parse(req.body)

			// Buscar usuario por email
			const user = await User.findOne({ email: validatedData.email })
			if (!user || !user.active) {
				return res.status(401).json({
					status: 'error',
					message: 'Credenciales inválidas',
				})
			}

			// Verificar contraseña
			const isValidPassword = await user.comparePassword(validatedData.password)
			if (!isValidPassword) {
				return res.status(401).json({
					status: 'error',
					message: 'Credenciales inválidas',
				})
			}

			// Generar token JWT
			const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
				expiresIn: process.env.JWT_EXPIRES_IN,
			})

			res.json({
				status: 'success',
				data: {
					user: {
						id: user._id,
						name: user.name,
						email: user.email,
						role: user.role,
					},
					token,
				},
			})
		} catch (error) {
			if (error.name === 'ZodError') {
				return res.status(400).json({
					status: 'error',
					message: 'Error de validación',
					errors: error.errors,
				})
			}
			res.status(500).json({
				status: 'error',
				message: 'Error al iniciar sesión',
			})
		}
	}

	// Obtener perfil del usuario actual
	async getProfile(req, res) {
		try {
			const user = await User.findById(req.user._id).select('-password')
			res.json({
				status: 'success',
				data: {
					user,
				},
			})
		} catch (error) {
			res.status(500).json({
				status: 'error',
				message: 'Error al obtener perfil',
			})
		}
	}
}

export default new AuthController()
