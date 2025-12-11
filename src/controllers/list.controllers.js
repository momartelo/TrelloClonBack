import { ListModel } from "../models/List.js";
import { BoardModel } from "../models/Board.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

export const ctrlCreateList = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { title, board } = req.body;
    const boardExists = await BoardModel.findById(board);
    if (!boardExists)
      return res.status(404).json({ error: "Board no encontrado" });
    const count = await ListModel.countDocuments({ board });
    const list = await ListModel.create({
      title,
      board,
      order: count,
    });
    res.status(201).json({ message: "Lista creada", list });
  } catch (error) {
    console.error("Error creando lista", error);
    res.status(500).json({ error: "No se pudo crear la lista" });
  }
};

export const ctrlGetList = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "ID Invalido" });

    const list = await ListModel.findById(id);
    if (!list) return res.status(404).json({ error: " Lista no encontrada" });

    res.status(200).json({ list });
  } catch (error) {
    console.error("Error obteniendo lista:", error);
    res.status(500).json({ error: "No se pudo obtener la lista" });
  }
};

export const ctrlGetListByBoard = async (req, res) => {
  try {
    const { id } = req.params;

    const lists = await ListModel.find({ board: id });

    return res.status(200).json({ lists });
  } catch (error) {
    console.error("Error obteniendo listas:", error);
    return res.status(500).json({ error: "No se pudieron obtener las listas" });
  }
};

export const ctrlUpdateList = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "ID inválido" });
    const allowed = ["title", "order"];
    const updateData = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    }
    const updated = await ListModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Lista no encontrada" });
    res.status(200).json({ message: "Lista Actualizada", list: updated });
  } catch (error) {
    console.error("Error actualizando lista:", error);
    res.status(500).json({ error: "No se pudo actualizar la lista" });
  }
};

export const ctrlDeleteList = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "ID inválido" });
    const deleted = await ListModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Lista no encontrada" });
    res.status(200).json({
      message: "Lista eliminada",
      list: {
        id: deleted._id,
        title: deleted.title,
      },
    });
  } catch (error) {
    console.error("Error eliminando lista:", error);
    res.status(500).json({ error: "No se pudo eliminar la lista" });
  }
};
