import "server-only";
import axios from "axios";

export const apiServer = axios.create({
  baseURL:
    process.env.API_URL ?? "http://localhost:8000/api/v1/",
  timeout: 10_000,
});
