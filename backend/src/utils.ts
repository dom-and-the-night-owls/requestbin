import { IncomingHttpHeaders } from "http";
import { customAlphabet } from "nanoid";
import { alphanumeric } from "nanoid-dictionary";

import { Request, PostgresRequestRow } from "./types";

export const generateRandomString: (length?: number) => string = customAlphabet(
  alphanumeric,
  7,
);

export function headersToString(headers: IncomingHttpHeaders): string {
  let headerString = "";
  for (const key in headers) {
    headerString += `${key}: ${headers[key]}\n`;
  }

  return headerString;
}

export function normalizeRequest(request: PostgresRequestRow): Request {
  return {
    basketName: request["basket_name"],
    sentAt: request["sent_at"],
    method: request["method"],
    headers: request["headers"],
    bodyMongoId: request["body_mongo_id"],
  };
}
