import { CardModel } from "../models/Card";
import { ListModel } from "../models/List";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

export const ctrlCreatedCard = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { title, list } = req.body;
    const listExists = await ListModel.findById(list);
    if (!listExists)
      return res.status(404).json({ error: "List no encontrada" });
    const count = await CardModel.countDocuments({ list });
    const card = await CardModel.create({ title, list, order: count });
    res.status(201).json({ message: "Card creada", card });
  } catch (error) {
    console.error("Error creando card:", error);
    res.status(500).json({ error: "No se pudo crear la card" });
  }
};

export const ctrlGetCard = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "ID Invalido" });

    const card = await CardModel.findById(id);
    if (!card) return res.status(404).json({ error: "Card no encontrada" });
    res.status(200).json({ card });
  } catch (error) {
    console.error("Error obteniendo card:", err);
    res.status(500).json({ error: "No se pudo obtener la card" });
  }
};

export const ctrlGetCardsByList = async (req, res) => {
  try {
    const { listId } = req.params;
    const cards = await CardModel.find({ list: listId }).sort({ order: 1 });
    res.status(200).json({ cards });
  } catch (error) {
    console.error("Error obteniendo cards:", err);
    res.status(500).json({ error: "No se pudieron obtener las cards" });
  }
};

export const ctrlUpdateCard = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "ID inválido" });
    const allowed = ["title", "description", "order", "list"];
    const updateData = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    }

    const updated = await CardModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Card no encontrada" });

    res.json({ message: "Card actualizada", card: updated });
  } catch (error) {
    console.error("Error actualizando card:", err);
    res.status(500).json({ error: "No se pudo actualizar la card" });
  }
};

export const ctrlDeleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "ID inválido" });
    const deleted = await CardModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Card no encontrada" });
    res.status(200).json({
      message: "Card eliminada",
      card: { id: deleted._id, title: deleted.title },
    });
  } catch (error) {
    console.error("Error eliminando card:", error);
    res.status(500).json({ error: "No se pudo eliminar la card" });
  }
};
