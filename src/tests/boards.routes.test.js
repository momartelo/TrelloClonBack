import request from "supertest";
import { app } from "../../index.js";
import mongoose from "mongoose";
import { startConnection } from "../settings/database.js";
import { config } from "../settings/config.js";

let token = "";
let boardId = "";

beforeAll(async () => {
  await startConnection({
    uri: config.mongo,
    database: config.database,
  });

  // Registramos usuario
  await request(app).post("/api/auth/register").send({
    username: "boarduser",
    email: "boards@test.com",
    password: "Pass1234!",
    gender: "MASC",
  });

  // Login
  const login = await request(app).post("/api/auth/login").send({
    email: "boards@test.com",
    password: "Pass1234!",
  });

  token = login.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// ---------------------------------------------------------------------

describe("Boards API", () => {
  // CREATE BOARD
  test("Debe crear un board válido", async () => {
    const res = await request(app)
      .post("/api/boards")
      .set("Authorization", "Bearer " + token)
      .send({
        title: "Mi primer board",
        color: "#FF0000",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("Mi primer board");

    boardId = res.body._id;
  });

  // GET ALL BOARDS
  test("Debe listar los boards del usuario", async () => {
    const res = await request(app)
      .get("/api/boards")
      .set("Authorization", "Bearer " + token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // GET BY ID
  test("Debe obtener un board por ID", async () => {
    const res = await request(app)
      .get(`/api/boards/${boardId}`)
      .set("Authorization", "Bearer " + token);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", boardId);
  });

  // INVALID ID
  test("Debe fallar si el ID es inválido", async () => {
    const res = await request(app)
      .get("/api/boards/123")
      .set("Authorization", "Bearer " + token);

    expect(res.statusCode).toBe(400);
  });

  // UPDATE BOARD
  test("Debe actualizar el título del board", async () => {
    const res = await request(app)
      .patch(`/api/boards/${boardId}`)
      .set("Authorization", "Bearer " + token)
      .send({
        title: "Board actualizado",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Board actualizado");
  });

  // ANTI-MASS-ASSIGNMENT
  test("Debe ignorar campos no permitidos", async () => {
    const res = await request(app)
      .patch(`/api/boards/${boardId}`)
      .set("Authorization", "Bearer " + token)
      .send({
        title: "Otro título",
        owner: "otro-usuario",
        createdAt: "2020-01-01",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Otro título");
    expect(res.body.owner).not.toBe("otro-usuario");
  });

  // DELETE BOARD
  test("Debe eliminar el board", async () => {
    const res = await request(app)
      .delete(`/api/boards/${boardId}`)
      .set("Authorization", "Bearer " + token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Board eliminado correctamente");
  });
});
