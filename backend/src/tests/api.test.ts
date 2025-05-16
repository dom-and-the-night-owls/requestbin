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
    expect(res.body).toEqual({ basketName: "3456789" });
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

  test("POST /api/baskets/:name with valid basket name returns basketName", async () => {
    jest.spyOn(pgClient, "addNewBasket").mockResolvedValue();
    jest.spyOn(pgClient, "doesBasketExist").mockResolvedValue(false);

    const res = await request(app).post("/api/baskets/newBasket");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("basketName");
    expect(typeof res.body.basketName).toBe("string");
    expect(res.headers["content-type"]).toMatch(/application\/json/);

    jest.restoreAllMocks();
  });

  test("POST /api/baskets/:name with invalid basket name returns Basket name taken", async () => {
    jest.spyOn(pgClient, "doesBasketExist").mockResolvedValue(true);

    const res = await request(app).post("/api/baskets/invalidNewBasket");

    expect(res.statusCode).toBe(409);
    expect(res.text).toBe("Basket name taken");

    jest.restoreAllMocks();
  });

  test("DELETE /api/baskets/:name with valid basket return 204 No content", async () => {
    jest.spyOn(pgClient, "doesBasketExist").mockResolvedValue(true);
    jest.spyOn(mongoClient, "deleteBodyRequests").mockResolvedValue(true);
    jest.spyOn(pgClient, "deleteBasket").mockResolvedValue(true);
    jest.spyOn(pgClient, "getBasketRequestBodyIds").mockResolvedValue(["bodyMongoId1", "bodyMongoId2"]);

    const res = await request(app).delete("/api/baskets/myBasket");

    expect(res.statusCode).toBe(204);

    jest.restoreAllMocks();
  });

  test("DELETE /api/baskets/:name with invalid basket return 404  Basket does not exist", async () => {
    jest.spyOn(pgClient, "doesBasketExist").mockResolvedValue(false);

    const res = await request(app).delete("/api/baskets/invalidBasket");

    expect(res.statusCode).toBe(404);
    expect(res.text).toBe("Basket does not exist");

    jest.restoreAllMocks();
  });

  test("GET /api/baskets/:name/requests with invalid basket return 404 Basket does not exist", async () => {
    jest.spyOn(pgClient, "doesBasketExist").mockResolvedValue(false);

    const res = await request(app).get("/api/baskets/invalidBasket/requests");

    expect(res.statusCode).toBe(404);
    expect(res.text).toBe("Basket does not exist");

    jest.restoreAllMocks();
  });

  test("GET /api/baskets/:name/requests with valid basket return 200 requests", async () => {
    jest.spyOn(pgClient, "doesBasketExist").mockResolvedValue(true);
    jest.spyOn(pgClient, "fetchBasketContents").mockResolvedValue([{
      basketName: "validBasket",
      sentAt: new Date().toISOString(),
      method: "GET",
      headers: '{"content-type":"application/json"}',
      bodyMongoId: "bodyMongoId123",
    }]);
    jest.spyOn(mongoClient, "getRequestBody").mockResolvedValue("bodyMongoId123");

    const res = await request(app).get("/api/baskets/validBasket/requests");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("requests");
    expect(Array.isArray(res.body.requests)).toBe(true);
    expect(res.body.requests.length).toBeGreaterThan(0);
    expect(res.body.requests[0]).toMatchObject({
      basketName: "validBasket",
      method: "GET",
    });

    jest.restoreAllMocks();
  });

  test("DELETE /api/baskets/:name/requests with invalid basket return 404 Basket does not exist", async () => {
    jest.spyOn(pgClient, "doesBasketExist").mockResolvedValue(false);

    const res = await request(app).delete("/api/baskets/invalidBasket/requests");

    expect(res.statusCode).toBe(404);
    expect(res.text).toBe("Basket does not exist");

    jest.restoreAllMocks();
  });

  test("DELETE /api/baskets/:name/requests with valid basket return 204 Basket has been cleared", async () => {
    jest.spyOn(pgClient, "doesBasketExist").mockResolvedValue(true);
    jest.spyOn(pgClient, "getBasketRequestBodyIds").mockResolvedValue(["bodyMongoId1", "bodyMongoId2"]);
    jest.spyOn(mongoClient, "deleteBodyRequests").mockResolvedValue(true);
    jest.spyOn(pgClient, "deleteBasketRequests").mockResolvedValue(true);

    const res = await request(app).delete("/api/baskets/validBasket/requests");

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Basket has been cleared");

    jest.restoreAllMocks();
  });

  test("GET /api/baskets/validate without query string return 400 Missing basket names", async () => {
    const res = await request(app).get("/api/baskets/validate");

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe("Missing basket names");

    jest.restoreAllMocks();
  });

  test("GET /api/baskets/validate with query string and existing baskets return 200 basketNames", async () => {
    jest.spyOn(pgClient, "getValidBaskets").mockResolvedValue(["validBasket1", "validBasket2"]);

    const res = await request(app).get("/api/baskets/validate?basketNames=validBasket1%2CinvalidBasket%2CvalidBasket2");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("basketNames");
    expect(Array.isArray(res.body.basketNames)).toBe(true);
    expect(res.body.basketNames.length).toBeGreaterThan(0);
    expect(res.body.basketNames[0]).toBe("validBasket1");

    jest.restoreAllMocks();
  });

  test("GET /api/baskets/validate with query string and all invalid baskets return 200 basketNames", async () => {
    jest.spyOn(pgClient, "getValidBaskets").mockResolvedValue([]);

    const res = await request(app).get("/api/baskets/validate?basketNames=invalidBasket1%2CinvalidBasket2%2CinvalidBasket3");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("basketNames");
    expect(Array.isArray(res.body.basketNames)).toBe(true);
    expect(res.body.basketNames.length).toBe(0);

    jest.restoreAllMocks();
  });
});
