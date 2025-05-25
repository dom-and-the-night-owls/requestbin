import { Request, Response, NextFunction } from "express";

export const rawBodyParser = (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  let data = "";

  req.setEncoding("utf8");
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    (req as any).rawBody = data;
    next();
  });
};
