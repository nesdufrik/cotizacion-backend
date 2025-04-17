import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'

// Importar rutas
import authRoutes from './routes/auth.routes.js'
import categoryRoutes from './routes/category.routes.js'
import quoteRoutes from './routes/quote.routes.js'
import clientRoutes from './routes/client.routes.js'

// Inicialización de Express
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Configuración de Swagger
const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'API de Cotizaciones',
			version: '1.0.0',
			description: 'API REST para sistema de cotizaciones de servicios',
		},
		servers: [
			{
				url: `http://localhost:${process.env.PORT || 3000}/api`,
				description: 'Servidor local con prefijo v.1.0.0',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	apis: ['./src/routes/*.js'],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/quotes', quoteRoutes)
app.use('/api/clients', clientRoutes)

// Ruta de bienvenida
app.get('/', (req, res) => {
	res.json({
		message: 'Bienvenido a la API de Cotizaciones',
		documentation: '/api-docs',
	})
})

// Manejo de rutas no encontradas
app.use((req, res, next) => {
	res.status(404).json({
		status: 'error',
		message: 'Ruta no encontrada',
	})
})

// Manejo de errores global
app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(err.status || 500).json({
		status: 'error',
		message: err.message || 'Error interno del servidor',
	})
})

export default app
