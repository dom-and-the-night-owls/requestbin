import { Express } from "express";
import "dotenv/config";
import { createApp } from "./main";
import PostgresClient from "./controllers/postgresql";
import MongoClient from "./controllers/mongo";

const PORT = process.env.PORT || 3000;
const environment = process.env.NODE_ENV;

async function startServer() {
  let app: Express;

  if (environment === "mock") {
    app = createApp(null as any, null as any);
  } else {
    const pg = new PostgresClient();
    const mongo = new MongoClient();
    await mongo.connectToDatabase();
    app = createApp(pg, mongo);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
