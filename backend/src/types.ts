import mongoose, { Document } from "mongoose";
import { PoolClient } from "pg";

export interface MockRequest {
  basketName: string;
  method: string;
  sentAt: string;
  headers: string;
  requestBodyContentType: string;
  requestBody: string;
}

export interface Basket {
  name: string;
  token: string;
}

export interface RequestBody extends Document {
  id: string;
  request: any;
}

export interface Request {
  basketName: string;
  sentAt: string;
  method: string;
  headers: string;
  bodyMongoId: string | null;
}

export interface PostgresRequestRow {
  basket_name: string;
  sent_at: string;
  method: string;
  headers: string;
  body_mongo_id: string;
}

export interface IPostgresClient {
  connect(): Promise<PoolClient>;
  disconnect(): Promise<void>;
  getBaskets(): Promise<any[]>;
  getBasketName(name: string): Promise<string | null>;
  getToken(tokenValue: string): Promise<any>;
  doesBasketExist(name: string): Promise<boolean>;
  storeToken(token: string, basketName: string): Promise<any>;
  addNewBasket(basketName: string): Promise<void>;
  saveRequest(request: any): Promise<any>;
  getBasketRequestBodyIds(basketName: string): Promise<string[]>;
  deleteBasketRequests(basketName: string): Promise<boolean>;
  deleteBasket(basketName: string): Promise<boolean>;
  fetchBasketContents(basketName: string): Promise<any[]>;
  getValidBaskets(basketNames: string[]): Promise<string[]>;
}

export interface IMongoClient {
  connectToDatabase(): Promise<void>;
  getModel(): mongoose.Model<RequestBody>;
  saveRequestBody(requestBody: any): Promise<string>;
  getRequestBody(bodyMongoId: string): Promise<any>;
  deleteBodyRequests(ids: string[]): Promise<boolean>;
  closeConnection(): Promise<void>;
}
