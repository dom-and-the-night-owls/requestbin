import "dotenv/config";
import express from "express";
import path from "path";
import type { Server } from "http";
import apiRouter from "./routes/api";
import hookRouter from "./routes/hook";
import PostgresClient from "./controllers/postgresql";
import MongoClient from "./controllers/mongo";
import { rawBodyParser } from "./middleware";
import config from "./config/config";

const initApp = async () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware to store raw data in the request
  app.use(rawBodyParser);

  app.use(express.json());
  app.use(express.static("dist"));

  const pg = new PostgresClient(config.getPGConfig());
  const mongo = new MongoClient(config.getMongoConfig());
  await mongo.connectToDatabase();

  app.use("/api", apiRouter(pg, mongo));
  app.use("/hook", hookRouter(pg, mongo));

  // Catch-all route enabling react refresh
  // express v5 requires * wildcard to have a name
  app.get("/*path", (_, res) => {
    res.sendFile(path.join(__dirname, "../dist", "index.html"));
  });

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => cleanup(server, pg, mongo));
  process.on("SIGINT", () => cleanup(server, pg, mongo));

  return { app, server, pg, mongo };
};

const cleanup = async (
  server: Server,
  pg: PostgresClient,
  mongo: MongoClient,
) => {
  console.log("Shutting down...");
  server.close();
  await mongo.closeConnection();
  await pg.disconnect();
  process.exit(0);
};

// Start the app server
initApp().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
