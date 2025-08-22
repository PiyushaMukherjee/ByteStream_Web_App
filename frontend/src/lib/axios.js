import axios from "axios";

// For production, you'll need to set this environment variable in Vercel
const BASE_URL = import.meta.env.VITE_API_URL || 
                 (import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api");

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});
