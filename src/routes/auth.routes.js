import { Router } from "express";
import {
  ctrlCreateUser,
  ctrlDeleteUser,
  ctrlLoginUser,
  ctrlUpdateUser,
} from "../controllers/user.controllers.js";
import {
  createUsersValidations,
  loginUserValidations,
} from "../validations/user.validations.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/login", loginUserValidations, ctrlLoginUser);
authRouter.post("/register", createUsersValidations, ctrlCreateUser);
authRouter.patch("/:id", verifyToken, ctrlUpdateUser);
authRouter.delete("/:id", verifyToken, ctrlDeleteUser);

export { authRouter };
