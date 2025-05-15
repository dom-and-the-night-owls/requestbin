import express, { Request, Response } from "express";
import { headersToString } from "../utils";
import { IMongoClient, IPostgresClient, Request as RequestType } from "../types";

export default function hookRouter(pg: IPostgresClient, mongo: IMongoClient) {
  const router = express.Router();

  router.all("/:name", async (req: Request<{ name: string }>, res: Response) => {
    const basketName = req.params.name;
    const exists: string | null = await pg.getBasketName(basketName);

    if (exists) {
      const request: RequestType = {
        basketName,
        sentAt: new Date().toISOString(),
        method: req.method,
        headers: headersToString(req.headers),
        bodyMongoId: null,
      };


      if ((req as any).rawBody) {

        const rawBody = (req as any).rawBody;
        request.bodyMongoId = await mongo.saveRequestBody(rawBody);
      }

      pg.saveRequest(request);
      res.status(204).json();
    } else {
      res.status(404).json({ message: "Basket not found" });
      return;
    }
  });

  return router;
}
