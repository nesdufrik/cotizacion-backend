import Service from "../models/service.model.js";
import { serviceSchema } from "../schemas/validation.schemas.js";

class ServiceController {
  // Obtener todos los servicios
  async getServices(req, res) {
    try {
      const services = await Service.find().populate("category");
      res.json({
        status: "success",
        data: { services },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los servicios",
      });
    }
  }

  // Crear un nuevo servicio
  async createService(req, res) {
    try {
      const validatedData = serviceSchema.parse(req.body);

      const service = new Service(validatedData);
      await service.save();

      res.status(201).json({
        status: "success",
        data: { service },
      });
    } catch (error) {
      if (error.name === "ZodError") {
        res.status(400).json({
          status: "error",
          message: "Error de validación",
          errors: error.errors,
        });
      }
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  // Obtener un servicio por ID
  async getServiceById(req, res) {
    try {
      const service = await Service.findById(req.params.id).populate(
        "category"
      );
      if (!service) {
        return res.status(404).json({
          status: "error",
          message: "Servicio no encontrado",
        });
      }
      res.json({
        status: "success",
        data: { service },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  // Actualizar un servicio
  async updateService(req, res) {
    try {
      const validatedData = serviceSchema.parse(req.body);
      const service = await Service.findOneAndUpdate(
        { _id: req.params.id },
        validatedData,
        { new: true }
      ).populate("category");

      if (!service) {
        return res.status(404).json({
          status: "error",
          message: "Servicio no encontrado",
        });
      }

      res.json({
        status: "success",
        data: { service },
      });
    } catch (error) {
      if (error.name === "ZodError") {
        res.status(400).json({
          status: "error",
          message: "Error de validación",
          errors: error.errors,
        });
      }
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  // Eliminar un servicio
  async deleteService(req, res) {
    try {
      const service = await Service.findByIdAndDelete(req.params.id);
      if (!service) {
        return res.status(404).json({
          status: "error",
          message: "Servicio no encontrado",
        });
      }
      res.json({
        status: "success",
        message: "Servicio eliminado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

export default new ServiceController();
