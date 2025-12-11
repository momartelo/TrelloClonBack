import { body, validationResult, param } from "express-validator";
import mongoose from "mongoose";

export const isValidEmail = (email) => {
  const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,6}$/;
  return REGEX_EMAIL.test(email);
};

export const isValidPassword = (password) => {
  const REGEX_PASSWORD =
    /^(?=(?:.*\d){4,})(?=.*[a-z])(?=.*[A-Z])(?=.*[!?@#$%^&*()_+]).{8,}$/;
  return REGEX_PASSWORD.test(password);
};

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ───────── VALIDACIÓN DE ID ─────────
export const validateUserId = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("ID de usuario inválido"),
  handleValidation,
];

export const createUsersValidations = [
  body("username")
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio")
    .isString()
    .trim(),
  body("email")
    .notEmpty()
    .withMessage("Email obligatorio")
    .bail()
    .custom(isValidEmail)
    .withMessage("Email no válido"),
  body("password")
    .notEmpty()
    .withMessage("Contraseña obligatoria")
    .bail()
    .custom(isValidPassword)
    .withMessage(
      "Contraseña debe tener min 1 mayúscula, 1 minúscula, 4 números, 1 símbolo y 8 caracteres"
    ),
  handleValidation,
];

export const loginUserValidations = [
  body("email")
    .notEmpty()
    .withMessage("Email obligatorio")
    .bail()
    .custom(isValidEmail)
    .withMessage("Email no válido"),
  body("password").notEmpty().withMessage("Contraseña obligatoria"),
  handleValidation,
];

export const updateUserValidations = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("ID inválido"),

  body("username")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre de usuario no puede estar vacío"),

  body("email").optional().custom(isValidEmail).withMessage("Email no válido"),

  body("password")
    .optional()
    .custom(isValidPassword)
    .withMessage(
      "La contraseña debe tener mínimo 1 mayúscula, 1 minúscula, 4 números, 1 símbolo y 8 caracteres"
    ),

  body("gender")
    .optional()
    .isIn(["MASC", "FEM", "NO-BIN"])
    .withMessage("Género no válido"),

  handleValidation,
];

export const deleteUserValidations = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("ID inválido"),
  handleValidation,
];
