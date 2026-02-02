import mongoose from 'mongoose'

const priceSheetServiceSchema = new mongoose.Schema(
	{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Service',
			required: true,
		},
		prices: [{
			price: {
				type: Number,
				required: true,
				min: 0
			}
		}],
		basePrice: {
			type: Number,
			min: 0,
			required: function() {
				return !this.prices || this.prices.length === 0;
			}
		}
	},
	{ _id: false }
)

const priceSheetSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
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
		services: [priceSheetServiceSchema],
		lastUpdated: {
			type: Date,
			default: Date.now,
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

// Middleware para actualizar lastUpdated
priceSheetSchema.pre('save', function (next) {
	this.lastUpdated = new Date()
	next()
})

const PriceSheet = mongoose.model('PriceSheet', priceSheetSchema)

export default PriceSheet