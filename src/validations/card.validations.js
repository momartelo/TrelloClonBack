import { body, param } from "express-validator";
import mongoose from "mongoose";

// ID de Card
export const validateCardId = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("ID de card inválido"),
];

// Crear Card
export const validateCreateCard = [
  body("title")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isString()
    .withMessage("El título debe ser un texto"),

  body("list")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("List ID inválido"),
];

// Actualizar Card
export const validateUpdateCard = [
  body("title")
    .optional()
    .isString()
    .withMessage("El título debe ser un texto"),

  body("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser un texto"),

  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El orden debe ser un número entero"),

  body("list")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("List ID inválido"),
];
