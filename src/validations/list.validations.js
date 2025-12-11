import { body, param } from "express-validator";
import mongoose from "mongoose";

export const validateListId = [
  param("id")
    .custom((id) => mongoose.Types.ObjectId.isValid(id))
    .withMessage("ID Invalido"),
];

export const validateCreateList = [
  body("title")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("El titulo es obligatorio"),
  body("board")
    .custom((id) => mongoose.Types.ObjectId.isValid(id))
    .withMessage("Board ID inválido"),
];

export const validateUpdateList = [
  body("title").optional().isString().trim().notEmpty(),
  body("board").optional().isNumeric(),
];
