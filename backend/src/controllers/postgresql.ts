import { Pool, PoolClient, QueryResult } from "pg";
import { Basket, Request, PGConfig } from "../types";
import { normalizeRequest } from "../utils";

class PostgresClient {
  pool: Pool;

  constructor(config?: PGConfig) {
    this.pool = new Pool(config);
    console.log("Connected to PostgreSQL server");
  }

  public async connect(): Promise<PoolClient> {
    try {
      const client = await this.pool.connect();
      console.log("Connected to PostgreSQL database.");
      return client;
    } catch (err) {
      console.error("Error connecting to PostgreSQL:", err);
      throw err;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.pool.end();
      console.log("Disconnected from PostgreSQL database.");
    } catch (err) {
      console.error("Error disconnecting from PostgreSQL:", err);
      throw err;
    }
  }

  public async getBaskets(): Promise<Basket[]> {
    const query: string = "SELECT * FROM baskets";
    try {
      return (await this.pool.query(query)).rows;
    } catch (err) {
      console.error("PostgreSQL: Error while getting basket names: ", err);
      throw new Error("PostgreSQL: Failed to get basket names");
    }
  }

  public async getBasketName(name: string): Promise<string | null> {
    const query: string = "SELECT name FROM baskets WHERE name = ($1)";
    const result: QueryResult = await this.pool.query(query, [name]);
    if (result.rows.length > 0) {
      return result.rows[0].name;
    } else {
      console.error("PostgreSQL: Basket not found");
      return null;
    }
  }

  public async getToken(tokenValue: string) {
    const query: string = "SELECT token FROM baskets WHERE token = ($1)";
    return await this.pool.query(query, [tokenValue]);
  }

  public async doesBasketExist(name: string): Promise<boolean> {
    const query: string = "SELECT * FROM baskets WHERE name = ($1)";
    let result: QueryResult = await this.pool.query(query, [name]);
    return (result.rowCount ?? 0) > 0;
  }

  public async storeToken(token: string, basketName: string): Promise<Basket> {
    const query: string =
      "UPDATE baskets SET token = ($1) WHERE name = $2 RETURNING *";

    try {
      const result: QueryResult = await this.pool.query(query, [
        token,
        basketName,
      ]);
      return result.rows[0];
    } catch (err) {
      console.error("PostgreSQL: Error inserting token:", token);
      throw new Error("PostgreSQL: Failed to store token");
    }
  }

  public async addNewBasket(basketName: string) {
    const query = "INSERT INTO baskets(name) VALUES ($1)";

    try {
      await this.pool.query(query, [basketName]);
    } catch (err) {
      console.error("PostgreSQL: Error creating basket");
      throw new Error("PostgreSQL: Failed to create basket");
    }
  }

  public async saveRequest({
    basketName,
    sentAt,
    method,
    headers,
    bodyMongoId,
  }: Request) {
    const query: string = `INSERT INTO requests (basket_name, sent_at, method, headers, body_mongo_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    try {
      const result: QueryResult = await this.pool.query(query, [
        basketName,
        sentAt,
        method,
        headers,
        bodyMongoId,
      ]);
      return result.rows[0];
    } catch (err) {
      console.error(
        "PostgreSQL: Error inserting request:",
        {
          basketName,
          sentAt,
          method,
          headers,
          bodyMongoId,
        },
        err,
      );
      throw new Error("PostgreSQL: Failed to store request");
    }
  }

  public async getBasketRequestBodyIds(basketName: string): Promise<string[]> {
    const query = "SELECT body_mongo_id FROM requests WHERE basket_name = ($1)";
    try {
      const result: QueryResult = await this.pool.query(query, [basketName]);
      return result.rows
        .filter(({ body_mongo_id }) => body_mongo_id)
        .map((record) => record.body_mongo_id);
    } catch (error) {
      console.error(
        "PostgreSQL: Error getting basket request body IDs for basket: ",
        basketName,
        error,
      );
      throw new Error("PostgreSQL: Failed to get basket request body IDs");
    }
  }

  public async deleteBasketRequests(basketName: string): Promise<boolean> {
    const query = "DELETE FROM requests WHERE basket_name = ($1)";
    try {
      const result: QueryResult = await this.pool.query(query, [basketName]);
      console.log(
        "PostgreSQL: ",
        result.rowCount,
        " deleted requests for basket",
        basketName,
      );
      return true;
    } catch (error) {
      console.error(
        `PostgreSQL: Error deleting requests bodies for basket: ${basketName}:`,
        error,
      );
      return false;
    }
  }

  public async deleteBasket(basketName: string): Promise<boolean> {
    const query = "DELETE FROM baskets WHERE name = ($1)";
    try {
      await this.pool.query(query, [basketName]);
      return true;
    } catch (error) {
      console.error(`PostgreSQL: Error deleting basket ${basketName}`, error);
      return false;
    }
  }

  public async fetchBasketContents(basketName: string): Promise<Request[]> {
    const query = "SELECT * FROM requests WHERE basket_name = $1";
    const result = await this.pool.query(query, [basketName]);
    return result.rows.map((basketItem) => normalizeRequest(basketItem));
  }

  public async getValidBaskets(basketNames: string[]): Promise<string[]> {
    let placeHolder = basketNames.map((_, idx) => `$${idx + 1}`).join(", ");

    const query = `SELECT name FROM baskets WHERE name = ANY(ARRAY[${placeHolder}]) ORDER BY created_at DESC;`;

    try {
      const result = await this.pool.query(query, basketNames);
      return result.rows.map((row) => row.name);
    } catch (error) {
      console.error("PostgreSQL: could not validate baskets", basketNames);
      throw new Error("PostgreSQL: Failed to validate baskets");
    }
  }
}

export default PostgresClient;
