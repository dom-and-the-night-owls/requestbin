import { Express } from "express";
import request from "supertest";
import { createApp } from "../main";
import { MongoMemoryServer } from "mongodb-memory-server";
import MongoClient from "../controllers/mongo";
import { Pool } from "pg";
import { newDb } from "pg-mem";
import PostgresClient from "../controllers/postgresql";

class TestPostgresClient extends PostgresClient {
  constructor(pool: Pool) {
    super();
    this.pool = pool;
  }
}

function setupTestPostgresClient(): TestPostgresClient {
  const pgMem = newDb();

  // This creates a pg-compatible client
  const client = pgMem.adapters.createPg();

  // Create schema
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

  return new TestPostgresClient(client.Pool);
}


describe("API tests with in-memory Mongo and Postgres", () => {
  let mongoServer: MongoMemoryServer;
  let app: Express;
  let mongoClient: MongoClient;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connectToDatabase();

    const pgClient = setupTestPostgresClient();
    app = createApp(pgClient, mongoClient);
  });

  afterAll(async () => {
    await mongoClient.closeConnection();
    await mongoServer.stop();
  });

  test("GET /ping returns pong", async () => {
    const res = await request(app).get("/ping");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("pong");
  });

  // test("GET /api/baskets returns json response", async () => {
  //   await request(app)
  //   .get("/api/baskets")
  //   .expect(200)
  //   .expect("Content-Type", /application\/json/);
  // });
});
