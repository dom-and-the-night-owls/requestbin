import { z } from "zod";

export const RequestSchema = z.object({
  basketName: z.string(),
  method: z.string(),
  sentAt: z.string(),
  headers: z.string(),
  requestBody: z.string().nullable(),
});

// export interface Request {
//   basketName: string;
//   method: string;
//   sentAt: string;
//   headers: string;
//   requestBody?: string;
// }

export type Request = z.infer<typeof RequestSchema>;
