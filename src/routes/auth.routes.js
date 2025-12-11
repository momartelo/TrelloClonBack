import { Router } from "express";
import {
  ctrlCreateUser,
  ctrlDeleteUser,
  ctrlGetMe,
  ctrlLoginUser,
  ctrlUpdateUser,
} from "../controllers/user.controllers.js";
import {
  createUsersValidations,
  deleteUserValidations,
  loginUserValidations,
  updateUserValidations,
} from "../validations/user.validations.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { allowOnly } from "../middlewares/antiMassAssignment.middleware.js";

const authRouter = Router();

authRouter.post("/login", loginUserValidations, ctrlLoginUser);
authRouter.post("/register", createUsersValidations, ctrlCreateUser);
authRouter.patch(
  "/:id",
  verifyToken,
  allowOnly(["username", "email", "password", "gender"]),
  updateUserValidations,
  ctrlUpdateUser
);
authRouter.delete("/:id", verifyToken, deleteUserValidations, ctrlDeleteUser);
authRouter.get("/me", verifyToken, ctrlGetMe);

export { authRouter };
