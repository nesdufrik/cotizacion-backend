import Accommodation from '../models/accommodation.model.js'

class AccommodationController {
    // Crear un nuevo servicio de hospedaje
    async createAccommodation(req, res) {
        try {
            const accommodation = new Accommodation(req.body)
            await accommodation.save()

            res.status(201).json({
                status: 'success',
                data: { accommodation }
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Error al crear el servicio de hospedaje',
                error: error.message
            })
        }
    }

    // Obtener todos los servicios de hospedaje
    async getAccommodations(req, res) {
        try {
            const accommodations = await Accommodation.find({ active: true })
            res.json({
                status: 'success',
                data: { accommodations }
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Error al obtener los servicios de hospedaje'
            })
        }
    }

    // Obtener un servicio de hospedaje por ID
    async getAccommodationById(req, res) {
        try {
            const accommodation = await Accommodation.findById(req.params.id)
            if (!accommodation) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Servicio de hospedaje no encontrado'
                })
            }

            res.json({
                status: 'success',
                data: { accommodation }
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Error al obtener el servicio de hospedaje'
            })
        }
    }

    // Actualizar un servicio de hospedaje
    async updateAccommodation(req, res) {
        try {
            const accommodation = await Accommodation.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            )

            if (!accommodation) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Servicio de hospedaje no encontrado'
                })
            }

            res.json({
                status: 'success',
                data: { accommodation }
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Error al actualizar el servicio de hospedaje'
            })
        }
    }

    // Eliminar un servicio de hospedaje (desactivar)
    async deleteAccommodation(req, res) {
        try {
            const accommodation = await Accommodation.findByIdAndUpdate(
                req.params.id,
                { active: false },
                { new: true }
            )

            if (!accommodation) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Servicio de hospedaje no encontrado'
                })
            }

            res.json({
                status: 'success',
                message: 'Servicio de hospedaje eliminado exitosamente'
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Error al eliminar el servicio de hospedaje'
            })
        }
    }
}

export default new AccommodationController()