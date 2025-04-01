import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

// Middleware para validar el token JWT
const authenticateToken = async (req, res, next) => {
	try {
		const authHeader = req.headers['authorization']
		const token = authHeader && authHeader.split(' ')[1]

		if (!token) {
			return res.status(401).json({
				status: 'error',
				message: 'No se proporcionó token de autenticación',
			})
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		const user = await User.findById(decoded.userId)

		if (!user || !user.active) {
			return res.status(401).json({
				status: 'error',
				message: 'Usuario no encontrado o inactivo',
			})
		}

		req.user = user
		next()
	} catch (error) {
		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({
				status: 'error',
				message: 'Token inválido',
			})
		}
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({
				status: 'error',
				message: 'Token expirado',
			})
		}
		next(error)
	}
}

// Middleware para validar roles
const authorizeRole = (roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({
				status: 'error',
				message: 'No tiene permisos para realizar esta acción',
			})
		}
		next()
	}
}

// Middleware para validación de esquemas Zod
const validateSchema = (schema) => {
	return (req, res, next) => {
		try {
			schema.parse(req.body)
			next()
		} catch (error) {
			return res.status(400).json({
				status: 'error',
				message: 'Error de validación',
				errors: error.errors.map((e) => ({
					path: e.path.join('.'),
					message: e.message,
				})),
			})
		}
	}
}

export { authenticateToken, authorizeRole, validateSchema }
