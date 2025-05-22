import express, { Request, Response } from "express";
import { generateRandomString, generateToken } from "../utils";
import PostgresClient from "../controllers/postgresql";
import MongoClient from "../controllers/mongo";

export default function basketRouter(pg: PostgresClient, mongo: MongoClient) {
  const router = express.Router();

  router.get("/health", async (_req: Request, res: Response) => {
    res.status(200).send();
  });

  router.get("/baskets", async (_req: Request, res: Response) => {
    const response = await pg.getBaskets();
    const basketNames = response.map(({ name }) => name);
    res.status(200).json({ basketNames });
  });

  router.get("/baskets/generate_name", async (_req: Request, res: Response) => {
    let basketName: string = "";

    do {
      basketName = generateRandomString().substring(2, 9);
    } while (await pg.doesBasketExist(basketName));

    res.status(200).json({ basketName });
  });

  router.get("/baskets/generate_token", async (req: Request, res: Response) => {
    const basketName = req.query.name;

    if (typeof basketName !== "string") {
      res.status(400).send("Missing basket name");
      return;
    } else if (!(await pg.doesBasketExist(basketName))) {
      res.status(404).send("Basket does not exist");
      return;
    }

    let token: string = await generateToken();
    await pg.storeToken(token, basketName);
    res.status(200).json({ token });
  });

  router.post("/baskets/:name", async (req: Request, res: Response) => {
    const basketName = req.params.name;

    if (await pg.doesBasketExist(basketName)) {
      res.status(409).json("Basket name taken");
      return;
    }

    await pg.addNewBasket(basketName);
    res.status(200).send({ basketName });
  });

  router.delete(
    "/baskets/:name",
    async (req: Request<{ name: string }>, res: Response) => {
      const basketName = req.params.name;

      if (!(await pg.doesBasketExist(basketName))) {
        res.status(404).send("Basket does not exist");
        return;
      }

      const mongoIds = await pg.getBasketRequestBodyIds(basketName);

      let successfulDelete =
        (await mongo.deleteBodyRequests(mongoIds)) &&
        (await pg.deleteBasket(basketName));

      if (successfulDelete) res.status(204).json();
    },
  );

  router.get(
    "/baskets/:name/requests",
    async (req: Request<{ name: string }>, res: Response) => {
      const basketName = req.params.name;

      if ((await pg.doesBasketExist(basketName)) === false) {
        res.status(404).send("Basket does not exist");
        return;
      }

      let result = await pg.fetchBasketContents(basketName);

      let mappedResult = result.map(async (request) => {
        let requestBody = null;

        if (request.bodyMongoId) {
          requestBody = await mongo.getRequestBody(request.bodyMongoId);
        }

        return {
          basketName: request.basketName,
          sentAt: request.sentAt,
          method: request.method,
          headers: request.headers,
          requestBody: requestBody,
        };
      });

      Promise.all(mappedResult).then((requests) =>
        res.status(200).json({ requests }),
      );
    },
  );

  router.delete(
    "/baskets/:name/requests",
    async (req: Request<{ name: string }>, res: Response) => {
      const basketName = req.params.name;

      if (!(await pg.doesBasketExist(basketName))) {
        res.status(404).send("Basket does not exist");
        return;
      }

      const mongoIds = await pg.getBasketRequestBodyIds(basketName);

      let successfulDelete =
        (await mongo.deleteBodyRequests(mongoIds)) &&
        (await pg.deleteBasketRequests(basketName));

      if (successfulDelete) res.status(204).send("Basket has been cleared");
    },
  );

  router.get("/baskets/validate", async (req: Request, res: Response) => {
    const queryString = req.query.basketNames;

    if (typeof queryString !== "string") {
      res.status(400).send("Missing basket names");
      return;
    }

    const basketNames = await pg.getValidBaskets(queryString.split(","));
    res.status(200).json({ basketNames });
  });

  return router;
}
