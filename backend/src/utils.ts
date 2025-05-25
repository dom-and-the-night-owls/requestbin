import { IncomingHttpHeaders } from "http";
import { Request, PostgresRequestRow } from "./types";

export function generateRandomString(length = 8) {
  let result = "";
  while (result.length < length) {
    result += Math.random().toString(36).substring(2);
  }
  return result.substring(0, length);
}

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
