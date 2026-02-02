import mongoose from 'mongoose'

const priceTierSchema = new mongoose.Schema(
	{
		service: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Service',
			required: true,
		},
		duration: {
			type: String,
			required: true,
			enum: ['15 mins', '35 mins', 'HD', 'FD', '2 Días'],
		},
		priceRanges: [
			{
				minPax: {
					type: Number,
					required: true,
					min: 1,
				},
				maxPax: {
					type: Number,
					required: true,
				},
				pricePerPax: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],
		activeFrom: {
			type: Date,
			default: Date.now,
		},
		activeTo: {
			type: Date,
		},
		isActive: {
			type: Boolean,
			default: true,
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

// Método para encontrar el precio según la cantidad de personas
priceTierSchema.methods.findPriceForPax = function (numberOfPax) {
	const applicableRange = this.priceRanges.find(
		(range) => numberOfPax >= range.minPax && numberOfPax <= range.maxPax
	)
	return applicableRange ? applicableRange.pricePerPax : null
}

const PriceTier = mongoose.model('PriceTier', priceTierSchema)

export default PriceTier