import "dotenv/config";
import express from "express";
import mockApiRouter from "./routes/mockApi";
import path from "path";
import apiRouter from "./routes/api";
import hookRouter from "./routes/hook";
import PostgresClient from "./controllers/postgresql";
import MongoClient from "./controllers/mongo";
import { rawBodyParser } from "./middleware";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to store raw data in the request
app.use(rawBodyParser);

app.use(express.json());
app.use(express.static("dist"));

const useMockAPI = process.env.USE_MOCK_API;
// allows us to run the mock api conditionally with:
// `API_MODE=mock  ts-node-dev ./src/main.ts`
// OR `npm run mock`

let pg: PostgresClient;
let mongo: MongoClient;

if (useMockAPI) {
  console.log("Starting mock API...");
  app.use("/mockApi", mockApiRouter);
} else {
  pg = new PostgresClient();
  mongo = new MongoClient();
  (async () => await mongo.connectToDatabase())();
  app.use("/api", apiRouter(pg, mongo));
  app.use("/hook", hookRouter(pg, mongo));
}

// Catch-all route enabling react refresh
// express v5 requires * wildcard to have a name
app.get("/*path", (_, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
