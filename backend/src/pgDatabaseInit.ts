import "dotenv/config";
import { Client } from "pg";
import * as fs from "node:fs";
import path from "node:path";
import config from "./config/config";

const CONFIG = config.getPGConfig();
const DB_NAME: string = CONFIG.database;

const isDatabaseCreated = async (client: Client): Promise<boolean> => {
  const query = "SELECT * FROM pg_database WHERE datname = $1";
  const result = await client.query(query, [DB_NAME]);
  return result.rowCount !== 0;
};

const createDatabase = async (client: Client) => {
  const query = `CREATE DATABASE ${DB_NAME}`;
  console.log("Creating PostgreSQL database");
  await client.query(query);
  console.log("Database created");
};

const initializeDB = async () => {
  const client: Client = new Client({
    ...CONFIG,
    database: "postgres", // connect to the default postgres db
  });

  try {
    await client.connect();

    if (await isDatabaseCreated(client)) {
      throw new Error(`Database ${DB_NAME} already exists.`);
    } else {
      await createDatabase(client);
    }
  } catch (error: unknown) {
    console.error("Database initialisation aborted:");
    throw error;
  } finally {
    await client.end();
  }
};

const createDatabaseTables = async () => {
  const client: Client = new Client(CONFIG);

  console.log("Creating database tables");
  await client.connect();

  try {
    const schemaPath = path.resolve(__dirname, "../", "schema.sql");
    const data = await fs.promises.readFile(schemaPath, { encoding: "utf8" });
    const response = await client.query(data);
    console.log("response:", response);
    console.log("Database tables created");
  } catch (error: unknown) {
    console.error("Failed to create database tables:", error);
    throw error;
  } finally {
    await client.end();
  }
};

const setupSchema = async () => {
  try {
    await initializeDB();
    await createDatabaseTables();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      throw error;
    }
  }
};

setupSchema();
