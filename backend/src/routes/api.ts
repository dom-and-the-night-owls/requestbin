import express, { Request, Response } from "express";
import { generateRandomString, generateToken } from "../utils";
import PostgresController from "../controllers/postgresql";
import MongoController from "../controllers/mongo";

const router = express.Router();

const useMockAPI = process.env.USE_MOCK_API;
let pg: PostgresController;

if (!useMockAPI) {
  pg = new PostgresController();
}

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
    res.status(422).send("Missing basket name");
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
    const mongo = new MongoController();
    await mongo.connectToDatabase();

    let successfulDelete =
      (await mongo.deleteBodyRequests(mongoIds)) &&
      (await pg.deleteBasket(basketName));
    await mongo.closeConnection();

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
    const mongo = new MongoController();
    await mongo.connectToDatabase();

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

    Promise.all(mappedResult).then((outcome) => res.status(200).json(outcome));
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
    const mongo = new MongoController();
    await mongo.connectToDatabase();

    let successfulDelete =
      (await mongo.deleteBodyRequests(mongoIds)) &&
      (await pg.deleteBasketRequests(basketName));
    await mongo.closeConnection();

    if (successfulDelete) res.status(204).json();
  }
);

export default router;
