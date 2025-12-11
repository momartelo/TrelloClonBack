import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { app } from "../../index.js";

import { UserModel } from "../models/User.js";
import { BoardModel } from "../models/Board.js";
import { ListModel } from "../models/List.js";
import { CardModel } from "../models/Card.js";

let mongo;
let token;
let boardId;
let listId;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);

  // Crear usuario
  const user = await UserModel.create({
    username: "tester",
    gender: "MASC",
    email: "tester@test.com",
    password: "Aa1234!!",
  });

  // Login para obtener token
  const login = await request(app)
    .post("/api/auth/login")
    .send({ email: "tester@test.com", password: "Aa1234!!" });

  token = login.body.token;

  // Crear board
  const board = await BoardModel.create({
    title: "Board Test",
    owner: user._id,
  });

  boardId = board._id;

  // Crear list
  const list = await ListModel.create({
    title: "List Test",
    board: boardId,
    order: 0,
  });

  listId = list._id;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

describe("Cards API", () => {
  test("Debe crear una card", async () => {
    const res = await request(app)
      .post("/api/cards")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Card A",
        list: listId,
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Card creada");
    expect(res.body.card.title).toBe("Card A");
  });

  test("Debe obtener una card por ID", async () => {
    const card = await CardModel.create({
      title: "Card B",
      list: listId,
      order: 1,
    });

    const res = await request(app)
      .get(`/api/cards/${card._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.card.title).toBe("Card B");
  });

  test("Debe obtener cards de una lista", async () => {
    await CardModel.create({
      title: "Card C",
      list: listId,
      order: 2,
    });

    const res = await request(app)
      .get(`/api/cards/list/${listId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.cards)).toBe(true);
    expect(res.body.cards.length).toBeGreaterThanOrEqual(2);
  });

  test("Debe actualizar una card", async () => {
    const card = await CardModel.create({
      title: "Old Card",
      list: listId,
      order: 3,
    });

    const res = await request(app)
      .patch(`/api/cards/${card._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Card" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Card actualizada");
    expect(res.body.card.title).toBe("Updated Card");
  });

  test("Debe eliminar una card", async () => {
    const card = await CardModel.create({
      title: "Delete Me",
      list: listId,
      order: 4,
    });

    const res = await request(app)
      .delete(`/api/cards/${card._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Card eliminada");
    expect(res.body.card.id).toBe(card._id.toString());
  });
});
