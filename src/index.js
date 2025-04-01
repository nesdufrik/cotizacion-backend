import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app.js'

// Conexión a MongoDB
mongoose
	.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cotizaciones')
	.then(() => console.log('Conectado a MongoDB'))
	.catch((err) => console.error('Error conectando a MongoDB:', err))

// Iniciar servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Servidor corriendo en puerto ${PORT}`)
})
