import mongoose from 'mongoose'

const quoteSchema = new mongoose.Schema(
	{
		customerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Client'
		},
		customerName: {
			type: String,
			required: true,
			trim: true,
		},
		customerEmail: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		services: [
			{
				service: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Service',
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
					default: 1,
				},
				price: {
					type: Number,
					required: true,
					min: 0,
				},
				discount: {
					type: Number,
					min: 0,
					max: 100,
					default: 0,
				},
			},
		],
		status: {
			type: String,
			enum: ['pending', 'approved', 'rejected', 'expired'],
			default: 'pending',
		},
		total: {
			type: Number,
			required: true,
			min: 0,
		},
		validUntil: {
			type: Date,
			required: true,
		},
		notes: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform: function (doc, ret) {
				ret.id = ret._id
				delete ret._id
				delete ret.__v
				return ret
			},
		},
	}
)

// Middleware para calcular el total antes de guardar
quoteSchema.pre('save', function (next) {
	if (this.services && this.services.length > 0) {
		this.total = this.services.reduce((acc, service) => {
			const subtotal = service.price * service.quantity
			const discount = subtotal * (service.discount / 100)
			return acc + (subtotal - discount)
		}, 0)
	}
	next()
})

const Quote = mongoose.model('Quote', quoteSchema)

export default Quote
