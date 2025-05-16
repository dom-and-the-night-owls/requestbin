import "dotenv/config";
import { createApp } from "./main";
import PostgresClient from "./controllers/postgresql";
import MongoClient from "./controllers/mongo";

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
