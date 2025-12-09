import { UserModel } from "../models/User.js";
import bcrypt from "bcrypt";
import { createJWT } from "../utils/jwt.js";

// ───────── REGISTRO ─────────
export const ctrlCreateUser = async (req, res) => {
  try {
    const user = new UserModel(req.body);
    const savedUser = await user.save();

    res.status(201).json({
      message: "Usuario creado con éxito",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        avatar: savedUser.avatar,
        isAdmin: savedUser.isAdmin,
      },
    });
  } catch (error) {
    console.error("❌ Error creando usuario:", error);
    res.status(400).json({
      error: "No se pudo crear el usuario",
      details: error.message,
    });
  }
};

// ───────── LOGIN ─────────
export const ctrlLoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Credenciales inválidas" });

    const token = await createJWT({
      id: user._id,
      email: user.email,
      role: user.isAdmin ? "admin" : "user",
    });

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("❌ Error login usuario:", error);
    res.status(500).json({ error: "No se pudo loguear el usuario" });
  }
};

// ───────── ACTUALIZAR USUARIO ─────────
export const ctrlUpdateUser = async (req, res) => {
  const userId = req.params.id;
  try {
    if (req.user.id !== userId && req.user.role !== "admin")
      return res
        .status(403)
        .json({ error: "No tienes permisos para esta acción" });

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    user.set(req.body);
    await user.save();

    res.status(200).json({
      message: "Usuario actualizado",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("❌ Error actualizando usuario:", error);
    res.status(500).json({ error: "No se pudo actualizar el usuario" });
  }
};

// ───────── ELIMINAR USUARIO ─────────
export const ctrlDeleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    if (req.user.id !== userId && req.user.role !== "admin")
      return res
        .status(403)
        .json({ error: "No tienes permisos para esta acción" });

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    await user.deleteOne();

    res.status(200).json({
      message: "Usuario eliminado",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Error eliminando usuario:", error);
    res.status(500).json({ error: "No se pudo eliminar el usuario" });
  }
};
