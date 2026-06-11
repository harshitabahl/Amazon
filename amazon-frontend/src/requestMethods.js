import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";

let user = null;

try {
  const stored = localStorage.getItem("persist:root");
  if (stored) {
    const parsed = JSON.parse(stored);
    user = parsed?.user ? JSON.parse(parsed.user) : null;
  }
} catch (e) {
  user = null;
}

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    token: user?.accessToken || "",
  },
});