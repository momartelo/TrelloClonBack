import { BoardModel } from "../models/Board.js";
import { UserModel } from "../models/User.js";

export const getBoards = async (req, res) => {
  try {
    const boards = await BoardModel.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    });

    res.status(200).json(boards);
  } catch (error) {
    res.status(400).json({
      error: "No se pudieron traer los tableros",
      detail: error.message,
    });
  }
};

export const createBoard = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "El título es obligatorio" });
    }

    const board = await BoardModel.create({
      title,
      owner: req.user.id,
      members: [],
      favorite: false,
    });

    res.status(201).json(board);
  } catch (error) {
    res.status(400).json({
      error: "No se pudo crear el tablero",
      detail: error.message,
    });
  }
};

export const getBoardById = async (req, res) => {
  try {
    const board = await BoardModel.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: "Board no encontrado" });
    }

    const hasAccess =
      board.owner.toString() === req.user.id ||
      board.members.map((m) => m.toString()).includes(req.user.id);

    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para ver este tablero" });
    }

    res.status(200).json(board);
  } catch (error) {
    res.status(400).json({
      error: "No se pudo encontrar el tablero",
      detail: error.message,
    });
  }
};

export const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, favorite } = req.body;

    const board = await BoardModel.findById(id);

    if (!board) {
      return res.status(404).json({ error: "Board no encontrado" });
    }

    // Solo owner puede editar
    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({
        error: "No tienes permiso para editar este tablero",
      });
    }

    if (title !== undefined) board.title = title;
    if (favorite !== undefined) board.favorite = favorite;

    await board.save();

    res.status(200).json(board);
  } catch (error) {
    res.status(400).json({
      error: "No se pudo actualizar el tablero",
      detail: error.message,
    });
  }
};

export const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;

    const board = await BoardModel.findById(id);

    if (!board) {
      return res.status(404).json({ error: "Board no encontrado" });
    }

    // Solo owner puede borrar
    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({
        error: "No tienes permiso para eliminar este tablero",
      });
    }

    await board.deleteOne();

    res.status(200).json({ message: "Board eliminado correctamente" });
  } catch (error) {
    res.status(400).json({
      error: "No se pudo eliminar el tablero",
      detail: error.message,
    });
  }
};

export const addMember = async (req, res) => {
  try {
    const boardId = req.params.id;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "El email es obligatorio" });
    }

    const userToAdd = await UserModel.findOne({ email });

    if (!userToAdd) {
      return res
        .status(404)
        .json({ error: "No existe un usuario con ese email" });
    }

    const board = await BoardModel.findById(boardId);

    if (!board) {
      return res.status(404).json({ error: "Board no encontrado" });
    }

    // Validar permisos
    if (board.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "No puedes agregar miembros a este board" });
    }

    // Evitar duplicados
    if (board.members.includes(userToAdd._id)) {
      return res
        .status(400)
        .json({ error: "Este usuario ya es miembro del board" });
    }

    // Evitar agregar al owner
    if (board.owner.toString() === userToAdd._id.toString()) {
      return res.status(400).json({ error: "El owner ya está en el board" });
    }

    board.members.push(userToAdd._id);
    await board.save();

    res.status(200).json({
      message: "Miembro agregado correctamente",
      board,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al agregar miembro", detail: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const boardId = req.params.id;
    const { email } = req.body;

    const userToRemove = await UserModel.findOne({ email });

    if (!userToRemove) {
      return res
        .status(404)
        .json({ error: "No existe un usuario con ese email" });
    }

    const board = await BoardModel.findById(boardId);

    if (!board) {
      return res.status(404).json({ error: "Board no encontrado" });
    }

    if (board.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "No puedes quitar miembros de este board" });
    }

    board.members = board.members.filter(
      (m) => m.toString() !== userToRemove._id.toString()
    );

    await board.save();

    res.status(200).json({ message: "Miembro eliminado", board });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al quitar miembro", detail: error.message });
  }
};
