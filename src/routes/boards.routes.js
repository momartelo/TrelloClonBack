import { Router } from "express";

import {
  addMember,
  createBoard,
  deleteBoard,
  getBoardById,
  getBoards,
  removeMember,
  updateBoard,
} from "../controllers/board.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const boardsRouter = Router();

boardsRouter.get("/", verifyToken, getBoards);
boardsRouter.post("/", verifyToken, createBoard);
boardsRouter.get("/:id", verifyToken, getBoardById);
boardsRouter.patch("/:id", verifyToken, updateBoard);
boardsRouter.delete("/:id", verifyToken, deleteBoard);

boardsRouter.patch("/:id/members/add", verifyToken, addMember);
boardsRouter.patch("/:id/members/remove", verifyToken, removeMember);

export { boardsRouter };
