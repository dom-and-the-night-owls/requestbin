// import { Express } from "express";
// import request from "supertest";
// import { createApp } from "../main";
// import { MongoMemoryServer } from "mongodb-memory-server";
// import mongoose from "mongoose";
// import { newDb } from "pg-mem";


// // Dummy wrappers for consistency
// class TestPostgresClient {
//   // mock or use real implementation with pg-mem here
//   constructor(public db: any) {}
// }

// class TestMongoClient {
//   constructor(public uri: string) {}
//   async connectToDatabase() {
//     await mongoose.connect(this.uri);
//   }
// }

// describe("API tests", () => {
//   let mongoServer: MongoMemoryServer;
//   let pgMem;
//   let app: Express;

//   beforeAll(async () => {
//     // In-memory Mongo
//     mongoServer = await MongoMemoryServer.create();
//     const mongoUri = mongoServer.getUri();
//     const mongoClient = new TestMongoClient(mongoUri);
//     await mongoClient.connectToDatabase();

//     // In-memory Postgres
//     pgMem = newDb();
//     const pg = new TestPostgresClient(pgMem);

//     // Inject into app
//     app = createApp(pg, mongoClient);
//   });

//   afterAll(async () => {
//     await mongoose.disconnect();
//     await mongoServer.stop();
//   });

//   test("GET /ping returns pong", async () => {
//     const res = await request(app).get("/ping");
//     expect(res.statusCode).toBe(200);
//     expect(res.text).toBe("pong");
//   });
// });
