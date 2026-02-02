import Quote from '../models/quote.model.js'
import EmailQuote from '../models/email-quote.model.js'
import Client from '../models/client.model.js'
import Service from '../models/service.model.js'
import PriceTier from '../models/price-tier.model.js'
import {
	quoteSchema,
	emailQuoteProcessSchema,
} from '../schemas/validation.schemas.js'

class QuoteController {
	// Crear una nueva cotización
	async createQuote(req, res) {
		try {
			const validatedData = quoteSchema.parse(req.body)

			// Verificar que el cliente existe
			const client = await Client.findById(validatedData.customerId)
			if (!client) {
				return res.status(404).json({
					status: 'error',
					message: 'Cliente no encontrado',
				})
			}

			// Obtener los servicios y calcular precios
			const quoteServices = []
			for (const serviceData of validatedData.services) {
				const service = await Service.findById(serviceData.service)
				if (!service) {
					return res.status(404).json({
						status: 'error',
						message: `Servicio ${serviceData.service} no encontrado`,
					})
				}

				// Buscar tarifa escalonada activa para el servicio
                const priceTier = await PriceTier.findOne({
                    service: service._id,
                    isActive: true,
                    $or: [
                        { activeTo: { $gt: new Date() } },
                        { activeTo: null }
                    ]
                })

                // Calcular precio basado en la cantidad de personas
                let price = service.basePrice
                if (priceTier) {
                    const tierPrice = priceTier.findPriceForPax(serviceData.quantity)
                    if (tierPrice !== null) {
                        price = tierPrice
                    }
                } else if (client.customPricing.has(service._id.toString())) {
                    // Aplicar precio personalizado si no hay tarifa escalonada
                    const customPrice = client.customPricing.get(service._id.toString())
                    price = customPrice.basePrice
                }

                quoteServices.push({
					service: service._id,
					quantity: serviceData.quantity,
					price,
					discount: serviceData.discount || 0,
				})
			}

			// Crear la cotización
			const quote = new Quote({
				customerId: client._id,
				services: quoteServices,
				validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
				notes: validatedData.notes,
			})

			await quote.save()

			res.status(201).json({
				status: 'success',
				data: { quote },
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
				message: 'Error al crear la cotización',
			})
		}
	}

	// Obtener todas las cotizaciones
	async getQuotes(req, res) {
		try {
			const quotes = await Quote.find()
				.populate('customerId', 'name email')
				.populate('services.service', 'name basePrice description')

			res.json({
				status: 'success',
				data: { quotes },
			})
		} catch (error) {
			res.status(500).json({
				status: 'error',
				message: 'Error al obtener las cotizaciones',
			})
		}
	}

	// Obtener una cotización por ID
	async getQuoteById(req, res) {
		try {
			const quote = await Quote.findById(req.params.id)
				.populate('customerId', 'name email')
				.populate('services.service', 'name basePrice description')

			if (!quote) {
				return res.status(404).json({
					status: 'error',
					message: 'Cotización no encontrada',
				})
			}

			res.json({
				status: 'success',
				data: { quote },
			})
		} catch (error) {
			res.status(500).json({
				status: 'error',
				message: 'Error al obtener la cotización',
			})
		}
	}

	// Procesar cotización desde email
	async processEmailQuote(req, res) {
		try {
			const validatedData = emailQuoteProcessSchema.parse(req.body)

			// Crear registro de email de cotización
			const emailQuote = new EmailQuote({
				subject: validatedData.subject,
				sender: validatedData.sender,
				originalHtml: validatedData.originalHtml,
				status: 'pending',
			})

			// Aquí iría la lógica de procesamiento del contenido del email
			// Por ejemplo, usar NLP para detectar servicios mencionados
			const detectedServices = [] // Implementar detección de servicios

			emailQuote.detectedServices = detectedServices
			await emailQuote.save()

			// Si se detectaron servicios, crear una cotización
			if (detectedServices.length > 0) {
				// Buscar o crear cliente
				let client = await Client.findOne({ email: validatedData.sender })
				if (!client) {
					client = new Client({
						email: validatedData.sender,
						name: validatedData.sender.split('@')[0], // Nombre temporal
					})
					await client.save()
				}

				// Crear cotización preliminar
				const quoteServices = detectedServices.map((service) => ({
					service: service.serviceName,
					quantity: service.quantity || 1,
					price: service.estimatedPrice,
					discount: 0,
				}))

				const quote = new Quote({
					customerId: client._id,
					services: quoteServices,
					status: 'pending',
					validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
				})

				await quote.save()
				emailQuote.processedQuote = quote._id
				emailQuote.status = 'processed'
				await emailQuote.save()
			}

			res.status(201).json({
				status: 'success',
				data: { emailQuote },
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
				message: 'Error al procesar la cotización por email',
			})
		}
	}

	// Actualizar estado de una cotización
	async updateQuoteStatus(req, res) {
		try {
			const { status } = req.body
			if (!['pending', 'approved', 'rejected', 'expired'].includes(status)) {
				return res.status(400).json({
					status: 'error',
					message: 'Estado de cotización inválido',
				})
			}

			const quote = await Quote.findByIdAndUpdate(
				req.params.id,
				{ status },
				{ new: true }
			)

			if (!quote) {
				return res.status(404).json({
					status: 'error',
					message: 'Cotización no encontrada',
				})
			}

			res.json({
				status: 'success',
				data: { quote },
			})
		} catch (error) {
			res.status(500).json({
				status: 'error',
				message: 'Error al actualizar el estado de la cotización',
			})
		}
	}
}

export default new QuoteController()
