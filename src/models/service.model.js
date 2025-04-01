import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
		location: {
			type: String,
			required: true,
			trim: true,
		},
		basePrice: {
			type: Number,
			required: true,
			min: 0,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		active: {
			type: Boolean,
			default: true,
		},
		lastUpdated: {
			type: Date,
			default: Date.now,
		},
		duration: {
			type: Number,
			min: 0,
			default: 60, // duración en minutos
		},
		materials: [
			{
				name: String,
				cost: Number,
			},
		],
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

// Middleware para actualizar lastUpdated
serviceSchema.pre('save', function (next) {
	this.lastUpdated = new Date()
	next()
})

const Service = mongoose.model('Service', serviceSchema)

export default Service
