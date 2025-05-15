import express, { Request, Response } from "express";
import { generateRandomString, generateToken } from "../utils";
import PostgresClient from "../controllers/postgresql";
import MongoClient from "../controllers/mongo";

export default function basketRouter(pg: PostgresClient, mongo: MongoClient) {
  const router = express.Router();

  router.get("/baskets", async (_req: Request, res: Response) => {
    const response = await pg.getBaskets();
    const baskets = response.map(({ name }) => name);
    res.status(200).json({ baskets });
  });

  router.get("/generate_name", async (_req: Request, res: Response) => {
    let basketName: string = "";

    do {
      basketName = generateRandomString().substring(2, 9);
    } while (await pg.doesBasketExist(basketName));

    res.status(200).json({ basketName });
  });

  router.get("/generate_token", async (req: Request, res: Response) => {
    const basketName = req.query.name;

    if (typeof basketName !== "string") {
      res.status(404).send("Missing basket name");
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
    }
  );

  router.get(
    "/baskets/:name/requests",
    async (req: Request<{ name: string }>, res: Response) => {
      const basketName = req.params.name;

      if ((await pg.doesBasketExist(basketName)) === false) {
        res.status(422).send("basket does not exist");
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
        res.status(200).json({ requests })
      );
    }
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

      if (successfulDelete) res.status(204).json();
    }
  );

  return router;
}
