import Client from "../models/client.model.js";
import { clientSchema } from "../schemas/validation.schemas.js";

class ClientController {
  // Obtener todos los clientes
  async getClients(req, res) {
    try {
      const clients = await Client.find({ active: true });
      res.json({
        status: "success",
        data: { clients },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los clientes",
      });
    }
  }

  // Crear un nuevo cliente
  async createClient(req, res) {
    try {
      const validatedData = clientSchema.parse(req.body);

      const client = new Client(validatedData);
      await client.save();

      res.status(201).json({
        status: "success",
        data: { client },
      });
    } catch (error) {
      if (error.name === "ZodError") {
        res.status(400).json({
          status: "error",
          message: "El código de cliente ya existe",
          errors: error.errors,
        });
      }
      res.status(500).json({
        status: "error",
        message: "Error al crear el cliente",
      });
    }
  }

  // Actualizar un cliente existente
  async updateClient(req, res) {
    try {
      const validatedData = clientSchema.parse(req.body);

      const client = await Client.findOneAndUpdate(
        { _id: req.params.id },
        validatedData,
        { new: true }
      );

      if (!client) {
        return res.status(404).json({
          status: "error",
          message: "Cliente no encontrado",
        });
      }

      res.json({
        status: "success",
        data: { client },
      });
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          status: "error",
          message: "El código de cliente ya existe",
          errors: error.errors,
        });
      }
      res.status(500).json({
        status: "error",
        message: "Error al actualizar el cliente",
      });
    }
  }
}

export default new ClientController();
