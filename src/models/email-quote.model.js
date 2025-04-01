import mongoose from 'mongoose'

const emailQuoteSchema = new mongoose.Schema(
	{
		subject: {
			type: String,
			required: true,
			trim: true,
		},
		sender: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		receivedAt: {
			type: Date,
			required: true,
			default: Date.now,
		},
		originalHtml: {
			type: String,
			required: true,
		},
		detectedServices: [
			{
				serviceName: String,
				confidence: Number,
				quantity: Number,
				estimatedPrice: Number,
			},
		],
		status: {
			type: String,
			enum: ['pending', 'processed', 'failed', 'ignored'],
			default: 'pending',
		},
		processedQuote: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Quote',
		},
		processingErrors: [
			{
				message: String,
				timestamp: {
					type: Date,
					default: Date.now,
				},
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

const EmailQuote = mongoose.model('EmailQuote', emailQuoteSchema)

export default EmailQuote
