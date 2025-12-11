import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../../index.js";
import { UserModel } from "../models/User.js";
import { BoardModel } from "../models/Board.js";

let mongo;
let token;
let boardId;

beforeAll(async () => {
  // FIX: inicialización correcta
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);

  const user = await UserModel.create({
    username: "tester",
    gender: "MASC",
    email: "tester@test.com",
    password: "Aa1234!!",
  });

  const login = await request(app)
    .post("/api/auth/login")
    .send({ email: "tester@test.com", password: "Aa1234!!" });

  token = login.body.token;

  const board = await BoardModel.create({
    title: "Board Test",
    owner: user._id,
  });

  boardId = board._id;
});

afterAll(async () => {
  // FIX: teardown más seguro
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

describe("Lists API", () => {
  test("Debe crear una lista", async () => {
    const res = await request(app)
      .post("/api/lists")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "To Do", board: boardId });

    expect(res.status).toBe(201);
    expect(res.body.list.title).toBe("To Do");
  });

  test("Debe obtener una lista por ID", async () => {
    const list = await request(app)
      .post("/api/lists")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Doing", board: boardId });

    const res = await request(app)
      .get(`/api/lists/${list.body.list._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.list.title).toBe("Doing");
  });

  test("Debe obtener listas del board", async () => {
    const res = await request(app)
      .get(`/api/lists/board/${boardId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.lists.length).toBeGreaterThanOrEqual(2);
  });

  test("Debe actualizar una lista", async () => {
    const list = await request(app)
      .post("/api/lists")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Old", board: boardId });

    const res = await request(app)
      .patch(`/api/lists/${list.body.list._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "New Title" });

    expect(res.status).toBe(200);
    expect(res.body.list.title).toBe("New Title");
  });

  test("Debe eliminar una lista", async () => {
    const list = await request(app)
      .post("/api/lists")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Delete Me", board: boardId });

    const res = await request(app)
      .delete(`/api/lists/${list.body.list._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Lista eliminada");
  });
});
