import { Express } from "express";
import request from "supertest";
import { createApp } from "../main";
import { MongoMemoryServer } from "mongodb-memory-server";
import MongoClient from "../controllers/mongo";
import { newDb } from "pg-mem";
import PostgresClient from "../controllers/postgresql";
import { Pool } from "pg";

class TestPostgresClient extends PostgresClient {
  constructor(pool: Pool) {
    super();
    this.pool = pool;
  }
}

function setupTestPostgresClient(): TestPostgresClient {
  const pgMem = newDb();

  pgMem.public.none(`
    CREATE TABLE baskets (
      name TEXT PRIMARY KEY,
      token TEXT
    );

    CREATE TABLE requests (
      id SERIAL PRIMARY KEY,
      basket_name TEXT REFERENCES baskets(name),
      sent_at TIMESTAMP,
      method TEXT,
      headers JSONB,
      body_mongo_id TEXT
    );
  `);

  const { Pool } = pgMem.adapters.createPg();
  const pool = new Pool();

  return new TestPostgresClient(pool);
}

jest.mock("../utils", () => {
  const originalModule = jest.requireActual("../utils");
  return {
    __esModule: true,
    ...originalModule,
    generateToken: jest.fn().mockResolvedValue("mock-token-123"),
    generateRandomString: jest.fn().mockReturnValue("12345678901"),
  };
});

describe("API tests with in-memory Mongo and Postgres", () => {
  let mongoServer: MongoMemoryServer;
  let app: Express;
  let mongoClient: MongoClient;
  let pgClient: TestPostgresClient;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connectToDatabase();

    pgClient = setupTestPostgresClient();
    app = createApp(pgClient, mongoClient);
  });

  afterAll(async () => {
    await mongoClient.closeConnection();
    await mongoServer.stop();
  });

  test("GET /ping", async () => {
    const res = await request(app).get("/ping");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("pong");
  });

  test("GET /api/baskets", async () => {
    await request(app)
      .get("/api/baskets")
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect({ basketNames: [] });
  });

  test("GET /api/baskets/generate_name", async () => {
    const res = await request(app).get("/api/baskets/generate_name");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("basketName");
    expect(typeof res.body.basketName).toBe("string");
    expect(res.body.basketName.length).toBe(7);
    expect(res.body).toEqual({basketName: "3456789"});
  });

  test("GET /api/baskets/generate_token without name returns 400", async () => {
    const res = await request(app).get("/api/baskets/generate_token");
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe("Missing basket name");
  });

  test("GET /api/baskets/generate_token with nonexistent basket returns 404", async () => {
    jest.spyOn(pgClient, "doesBasketExist").mockResolvedValue(false);

    const res = await request(app).get(
      "/api/baskets/generate_token?name=testBasket"
    );

    expect(res.statusCode).toBe(404);
    expect(res.text).toBe("Basket does not exist");

    jest.restoreAllMocks();
  });

  test("GET /api/baskets/generate_token with existing basket returns token", async () => {
    jest.spyOn(pgClient, "doesBasketExist").mockResolvedValue(true);
    jest
      .spyOn(pgClient, "storeToken")
      .mockResolvedValue({ name: "testBasket", token: "mock-token-123" });

    const res = await request(app).get(
      "/api/baskets/generate_token?name=testBasket"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");

    jest.restoreAllMocks();
  });
});
