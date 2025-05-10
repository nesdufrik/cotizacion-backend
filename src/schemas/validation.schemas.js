import { z } from 'zod'

// Esquema de registro de usuario
const userRegisterSchema = z.object({
	email: z.string().email('Email inválido'),
	password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
	name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
	role: z.enum(['admin', 'user']).optional(),
})

// Esquema de login
const userLoginSchema = z.object({
	email: z.string().email('Email inválido'),
	password: z.string().min(1, 'La contraseña es requerida'),
})

// Esquema de categoría
const categorySchema = z.object({
	name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
	description: z
		.string()
		.min(10, 'La descripción debe tener al menos 10 caracteres'),
})

// Esquema de cliente
const clientSchema = z.object({
	name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
	email: z.string().email('Email inválido'),
	phone: z.string().optional(),
	address: z.string().optional(),
	notes: z.string().optional(),
	customPricing: z.boolean().optional()
})

// Esquema de hoja de precios
const priceSheetSchema = z.object({
	name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
	description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
	services: z.array(
		z.object({
			id: z.string().min(1, 'El ID del servicio es requerido'),
			price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
		})
	).min(1, 'Debe incluir al menos un servicio'),
})

// Esquema de servicio
const serviceSchema = z.object({
	name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
	category: z.string().min(1, 'La categoría es requerida'),
	location: z.string().min(1, 'La ubicación es requerida'),
	basePrice: z.number().min(0, 'El precio base debe ser mayor o igual a 0'),
	description: z
		.string()
		.min(10, 'La descripción debe tener al menos 10 caracteres'),
	duration: z.number().min(0).optional(),
	materials: z
		.array(
			z.object({
				name: z.string(),
				cost: z.number().min(0),
			})
		)
		.optional(),
})

// Esquema de cotización
const quoteSchema = z.object({
	customerId: z.string().min(1, 'El ID del cliente es requerido'),
	services: z
		.array(
			z.object({
				service: z.string().min(1, 'El ID del servicio es requerido'),
				quantity: z.number().min(1, 'La cantidad debe ser al menos 1'),
				discount: z.number().min(0).max(100).optional(),
			})
		)
		.min(1, 'Debe incluir al menos un servicio'),
	notes: z.string().optional(),
})

// Esquema de procesamiento de email
const emailQuoteProcessSchema = z.object({
	subject: z.string().min(1, 'El asunto es requerido'),
	sender: z.string().email('Email del remitente inválido'),
	originalHtml: z.string().min(1, 'El contenido HTML es requerido'),
})

export {
	userRegisterSchema,
	userLoginSchema,
	categorySchema,
	clientSchema,
	serviceSchema,
	quoteSchema,
	emailQuoteProcessSchema,
	priceSheetSchema,
}
