import "dotenv/config";
import express from "express";
import mockApiRouter from "./routes/mockApi";
import apiRouter from "./routes/api";
import hookRouter from "./routes/hook";
import PostgresClient from "./controllers/postgresql";
import MongoClient from "./controllers/mongo";
import { IMongoClient, IPostgresClient } from "./types";

export function createApp(pg: IPostgresClient, mongo: IMongoClient) {
  const app = express();

  // Middleware to store raw data in the request
  app.use((req, _res, next) => {
    let data = "";

    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      (req as any).rawBody = data;
      next();
    });
  });

  app.use(express.json());
  app.use(express.static("dist"));

  const environment = process.env.NODE_ENV;

  if (environment === "mock") {
    console.log("Starting mock API...");
    app.use("/mockApi", mockApiRouter);
  } else {
    app.use("/api", apiRouter(pg, mongo));
    app.use("/hook", hookRouter(pg, mongo));
  }

  app.get("/ping", (_req, res) => {
    console.log("someone pinged here");
    res.send("pong");
  });

  return app;
}

const PORT = process.env.PORT || 3000;

(async () => {
  const pg = new PostgresClient();
  const mongo = new MongoClient();
  await mongo.connectToDatabase();

  const app = createApp(pg, mongo);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();