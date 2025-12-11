import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../index.js";
import { UserModel } from "../models/User.js";

const TEST_USER = {
  username: "testuser",
  email: "test@correo.com",
  password: "Aa1234!!",
  gender: "MASC",
};

let token = "";
let userId = "";

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/trello_test");
  await UserModel.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

// ───────────────────────────
// TEST: REGISTRO
// ───────────────────────────
describe("POST /api/auth/register", () => {
  test("Debe registrar un usuario válido", async () => {
    const res = await request(app).post("/api/auth/register").send(TEST_USER);

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(TEST_USER.email);

    userId = res.body.user.id;
  });

  test("Debe fallar si el email es inválido", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        ...TEST_USER,
        email: "correo@@@",
      });

    expect(res.statusCode).toBe(400);
  });

  test("Debe fallar si la contraseña no cumple reglas", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        ...TEST_USER,
        email: "otro@correo.com",
        password: "abc",
      });

    expect(res.statusCode).toBe(400);
  });
});

// ───────────────────────────
// TEST: LOGIN
// ───────────────────────────
describe("POST /api/auth/login", () => {
  test("Debe hacer login con credenciales correctas", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test("Debe fallar si la contraseña no coincide", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: TEST_USER.email,
      password: "malapass",
    });

    expect(res.statusCode).toBe(400);
  });
});

// ───────────────────────────
// TEST: ME
// ───────────────────────────
describe("GET /api/auth/me", () => {
  test("Debe devolver usuario autenticado", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(TEST_USER.email);
  });
});

// ───────────────────────────
// TEST: UPDATE USER
// ───────────────────────────
describe("PATCH /api/auth/:id", () => {
  test("Debe actualizar username correctamente", async () => {
    const res = await request(app)
      .patch(`/api/auth/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "nuevoNombre" });

    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe("nuevoNombre");
  });

  test("Debe fallar si el ID es inválido", async () => {
    const res = await request(app)
      .patch("/api/auth/123")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "xxx" });

    expect(res.status).toBe(400);
  });

  test("Debe ignorar campos no permitidos (anti-mass-assignment)", async () => {
    const res = await request(app)
      .patch(`/api/auth/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "segundoNombre",
        isAdmin: true,
        createdAt: "2000",
      });

    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe("segundoNombre");
    expect(res.body.user.isAdmin).toBe(false);
  });
});

// ───────────────────────────
// TEST: DELETE USER
// ───────────────────────────
describe("DELETE /api/auth/:id", () => {
  test("Debe eliminar el usuario", async () => {
    const res = await request(app)
      .delete(`/api/auth/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe(userId);
  });
});
