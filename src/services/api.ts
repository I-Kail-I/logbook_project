import axios from "axios";

const BASE_URL = "https://remun.unm.ac.id";

export const API_HEADERS = {
  Key: "remun-mob-53c4ebc7-2294-42b2-abe1-5ded30460f36",
  App: "remun-mob",
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    ...API_HEADERS,
  },
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default api;