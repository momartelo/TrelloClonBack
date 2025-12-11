import { body, param } from "express-validator";
import mongoose from "mongoose";

export const validateBoardId = [
  param("id")
    .custom((id) => mongoose.Types.ObjectId.isValid(id))
    .withMessage("ID Invalido"),
];

export const validateCreateBoard = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isString()
    .withMessage("El título debe ser un texto"),
];

export const validateUpdateBoard = [
  body("title")
    .optional()
    .isString()
    .withMessage("El título debe ser un texto")
    .trim(),

  body("favorite")
    .optional()
    .isBoolean()
    .withMessage("Favorite debe ser boolean"),
];
export const validateMemberEmail = [
  body("email")
    .isEmail()
    .withMessage("Debe ingresar un email válido")
    .normalizeEmail(),
];
