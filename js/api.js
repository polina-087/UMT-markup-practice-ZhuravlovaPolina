import axios from "https://cdn.jsdelivr.net/npm/axios@1.7.9/+esm";
import { API_BASE_URL } from "./config.js";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

const adaptBouquet = (bouquet) => ({
  ...bouquet,
  name: bouquet.title,
  image: bouquet.photoURL,
  featured: bouquet.favorite,
});

export const getBouquets = async ({ page, limit, category, featured } = {}) => {
  const params = {};
  if (page) params.page = page;          
  if (limit) params.limit = limit;      
  if (category && category !== "all") params.category = category;
  if (typeof featured === "boolean") params.favorite = featured;

  const response = await apiClient.get("/bouquets", { params });
  const items = response.data.data || response.data;
  return items.map(adaptBouquet);
};

export const getBestsellers = async () => {
  const { data } = await apiClient.get("/bouquets", { params: { favorite: true } });
  return data.map(adaptBouquet);
};

export const getFeedbacks = async () => {
  const { data } = await apiClient.get("/feedbacks");
  return data;
};

export const postOrder = async (orderData) => {
  const { data } = await apiClient.post("/orders", orderData);
  return data;
};