import { body, validationResult } from "express-validator";

export const isValidEmail = (email) => {
  const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,6}$/;
  return REGEX_EMAIL.test(email);
};

export const isValidPassword = (password) => {
  const REGEX_PASSWORD =
    /^(?=(?:.*\d){4,})(?=.*[a-z])(?=.*[A-Z])(?=.*[!?@#$%^&*()_+]).{8,}$/;
  return REGEX_PASSWORD.test(password);
};

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};

export const createUsersValidations = [
  body("username")
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio"),
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
