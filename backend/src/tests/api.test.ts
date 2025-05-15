// // import { Express } from "express";
// // import request from "supertest";
// // import { createApp } from "../main";
// import { MongoMemoryServer } from "mongodb-memory-server";
// import mongoose from "mongoose";
// // import { newDb } from "pg-mem";
// // import PostgresClient from "../controllers/postgresql";
// import MongoClient from "../controllers/mongo";

// describe("API tests with in-memory Mongo and Postgres", () => {
//   let mongoServer: MongoMemoryServer;
//   // let app: Express;

//   beforeAll(async () => {
//     mongoServer = await MongoMemoryServer.create();
//     const mongoUri = `${mongoServer.getUri()}/testRequestBodies`;
//     const mongoClient = new MongoClient(mongoUri);
//     await mongoClient.connectToDatabase();

//     // const pgMem = newDb();
//     // Use pgMem to set up schema and mock PostgresClient
//     // const pgClient = setupPgClient(pgMem); // We'll define this below

//     // Create app with in-memory DBs
//     // app = createApp(pgClient, mongoClient);
//   });

//   afterAll(async () => {
//     await mongoose.disconnect();
//     await mongoServer.stop();
//   });

//   test("GET /ping returns pong", async () => {

//   });
// });
