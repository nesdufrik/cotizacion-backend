import PriceSheet from "../models/priceSheet.model.js";
import Service from "../models/service.model.js";
import { priceSheetSchema } from "../schemas/validation.schemas.js";
import mongoose from 'mongoose'

class PriceSheetController {
    // Obtener todas las hojas de precios
    async getPriceSheets(req, res) {
        try {
            const priceSheets = await PriceSheet.find({ active: true }).select("-services");

            res.json({
                status: "success",
                data: { priceSheets },
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Error al obtener las hojas de precios",
            });
        }
    }

    // Obtener una hoja de precios por ID
    async getPriceSheetById(req, res) {
        try {
            const priceSheet = await PriceSheet.aggregate([
                { $match: { _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) } },
                {
                    $lookup: {
                        from: "services",
                        localField: "services.id",
                        foreignField: "_id",
                        as: "serviceDetails",
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "serviceDetails.category",
                        foreignField: "_id",
                        as: "categoryDetails"
                    }
                },
                {
                    $addFields: {
                        id: "$_id",
                        services: {
                            $map: {
                                input: "$services",
                                as: "serviceItem",
                                in: {
                                    $mergeObjects: [
                                        {
                                            name: {
                                                $arrayElemAt: [
                                                    "$serviceDetails.name",
                                                    { $indexOfArray: ["$serviceDetails._id", "$$serviceItem.service"] },
                                                ]
                                            },
                                            description: {
                                                $arrayElemAt: [
                                                    "$serviceDetails.description",
                                                    { $indexOfArray: ["$serviceDetails._id", "$$serviceItem.service"] },
                                                ]
                                            },
                                            id: "$$serviceItem.id",
                                            category: {
                                                $arrayElemAt: [
                                                    "$categoryDetails.name",
                                                    { $indexOfArray: ["$categoryDetails._id", "$$serviceItem.service"] },
                                                ]
                                            }
                                        },
                                        {
                                            price: "$$serviceItem.price"
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        serviceDetails: 0,
                        categoryDetails: 0,
                        __v: 0,
                        _id: 0
                    }
                }
            ])

            if (!priceSheet) {
                return res.status(404).json({
                    status: "error",
                    message: "Hoja de precios no encontrada",
                });
            }

            res.json({
                status: "success",
                data: { priceSheet: priceSheet[0] },
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Error al obtener la hoja de precios",
            });
        }
    }

    // Crear una nueva hoja de precios
    async createPriceSheet(req, res) {
        try {
            const validatedData = priceSheetSchema.parse(req.body);

            // Verificar que todos los servicios existan
            const serviceIds = validatedData.services.map((item) => item.id);
            const existingServices = await Service.find({ _id: { $in: serviceIds } });
            console.log({ existingServices })

            if (existingServices.length !== serviceIds.length) {
                return res.status(400).json({
                    status: "error",
                    message: "Uno o más servicios no existen",
                });
            }

            const priceSheet = new PriceSheet(validatedData);
            await priceSheet.save();

            res.status(201).json({
                status: "success",
                data: { priceSheet },
            });
        } catch (error) {
            if (error.name === "ZodError") {
                return res.status(400).json({
                    status: "error",
                    message: "Error de validación",
                    errors: error.errors,
                });
            }
            res.status(500).json({
                status: "error",
                message: "Error al crear la hoja de precios",
                errors: error.errors
            });
        }
    }

    // Actualizar una hoja de precios existente
    async updatePriceSheet(req, res) {
        try {
            const validatedData = priceSheetSchema.parse(req.body);

            // Verificar que todos los servicios existan
            const serviceIds = validatedData.services.map((item) => item.service);
            const existingServices = await Service.find({ _id: { $in: serviceIds } });

            if (existingServices.length !== serviceIds.length) {
                return res.status(400).json({
                    status: "error",
                    message: "Uno o más servicios no existen",
                });
            }

            const priceSheet = await PriceSheet.findOneAndUpdate(
                { _id: req.params.id },
                validatedData,
                { new: true }
            ).populate({
                path: "services.service",
                select: "name description category",
                populate: { path: "category", select: "name" },
            });

            if (!priceSheet) {
                return res.status(404).json({
                    status: "error",
                    message: "Hoja de precios no encontrada",
                });
            }

            res.json({
                status: "success",
                data: { priceSheet },
            });
        } catch (error) {
            if (error.name === "ZodError") {
                return res.status(400).json({
                    status: "error",
                    message: "Error de validación",
                    errors: error.errors,
                });
            }
            res.status(500).json({
                status: "error",
                message: "Error al actualizar la hoja de precios",
            });
        }
    }

    // Eliminar una hoja de precios
    async deletePriceSheet(req, res) {
        try {
            const priceSheet = await PriceSheet.findByIdAndDelete(req.params.id);

            if (!priceSheet) {
                return res.status(404).json({
                    status: "error",
                    message: "Hoja de precios no encontrada",
                });
            }

            res.json({
                status: "success",
                message: "Hoja de precios eliminada correctamente",
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Error al eliminar la hoja de precios",
            });
        }
    }
}

export default new PriceSheetController();
