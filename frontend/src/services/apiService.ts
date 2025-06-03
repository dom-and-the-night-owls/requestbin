import axios from "axios";
import { z } from "zod";
import { RequestSchema } from "../types";
import type { Request } from "../types";

// TODO: this should be an env var
// const API_BASE = "/mockApi";
const API_BASE = "/api";

const getBaskets = async (): Promise<Array<string>> => {
  const response = await axios.get(`${API_BASE}/baskets`);
  const parsedBasketNames = z.string().array().parse(response.data.basketNames);
  return parsedBasketNames;
};

const getValidBaskets = async (
  basketNames: Array<string>,
): Promise<Array<string>> => {
  const response = await axios.get(`${API_BASE}/baskets/validate`, {
    params: { basketNames: basketNames.join(",") },
  });

  const parsedValidBasketNames = z
    .string()
    .array()
    .parse(response.data.basketNames);
  return parsedValidBasketNames;
};

const getToken = async (basketName: string): Promise<string> => {
  const response = await axios.get(`${API_BASE}/baskets/generate_token/`, {
    params: { name: basketName },
  });

  const parsedToken = z.string().parse(response.data.token);
  return parsedToken;
};

const generateName = async (): Promise<string> => {
  const response = await axios.get(`${API_BASE}/baskets/generate_name`);
  const parsedName = z.string().parse(response.data.basketName);
  return parsedName;
};

const createBasket = async (basketName: string): Promise<string> => {
  const response = await axios.post(`${API_BASE}/baskets/${basketName}`);
  const parsedBasketName = z.string().parse(response.data.basketName);
  return parsedBasketName;
};

const deleteBasket = async (basketName: string): Promise<void> => {
  await axios.delete(`${API_BASE}/baskets/${basketName}`);
};

const getRequests = async (
  basketName: string,
  abortSignal?: AbortSignal,
): Promise<Array<Request>> => {
  const response = await axios.get(
    `${API_BASE}/baskets/${basketName}/requests`,
    {
      signal: abortSignal,
    },
  );

  const requests = response.data.requests;
  const parsedRequests = RequestSchema.array().parse(requests);
  return parsedRequests;
};

const clearBasket = async (basketName: string): Promise<void> => {
  await axios.delete(`${API_BASE}/baskets/${basketName}/requests`);
};

export default {
  getBaskets,
  getValidBaskets,
  getToken,
  generateName,
  createBasket,
  deleteBasket,
  getRequests,
  clearBasket,
};
