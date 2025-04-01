import Category from '../models/category.model.js'
import { categorySchema } from '../schemas/validation.schemas.js'

class CategoryController {
	// Obtener todas las categorías
	async getCategories(req, res) {
		try {
			const categories = await Category.find({ active: true })
			res.json({
				status: 'success',
				data: { categories },
			})
		} catch (error) {
			res.status(500).json({
				status: 'error',
				message: 'Error al obtener categorías',
			})
		}
	}

	// Obtener una categoría por ID
	async getCategoryById(req, res) {
		try {
			const category = await Category.findOne({
				_id: req.params.id,
				active: true,
			})

			if (!category) {
				return res.status(404).json({
					status: 'error',
					message: 'Categoría no encontrada',
				})
			}

			res.json({
				status: 'success',
				data: { category },
			})
		} catch (error) {
			res.status(500).json({
				status: 'error',
				message: 'Error al obtener la categoría',
			})
		}
	}

	// Crear una nueva categoría
	async createCategory(req, res) {
		try {
			const validatedData = categorySchema.parse(req.body)

			const category = new Category(validatedData)
			await category.save()

			res.status(201).json({
				status: 'success',
				data: { category },
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
				message: 'Error al crear la categoría',
			})
		}
	}

	// Actualizar una categoría
	async updateCategory(req, res) {
		try {
			const validatedData = categorySchema.parse(req.body)

			const category = await Category.findOneAndUpdate(
				{ _id: req.params.id, active: true },
				validatedData,
				{ new: true }
			)

			if (!category) {
				return res.status(404).json({
					status: 'error',
					message: 'Categoría no encontrada',
				})
			}

			res.json({
				status: 'success',
				data: { category },
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
				message: 'Error al actualizar la categoría',
			})
		}
	}

	// Eliminar una categoría (soft delete)
	async deleteCategory(req, res) {
		try {
			const category = await Category.findOneAndUpdate(
				{ _id: req.params.id, active: true },
				{ active: false },
				{ new: true }
			)

			if (!category) {
				return res.status(404).json({
					status: 'error',
					message: 'Categoría no encontrada',
				})
			}

			res.json({
				status: 'success',
				message: 'Categoría eliminada exitosamente',
			})
		} catch (error) {
			res.status(500).json({
				status: 'error',
				message: 'Error al eliminar la categoría',
			})
		}
	}
}

export default new CategoryController()
