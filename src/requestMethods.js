import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";

const persistRoot = JSON.parse(localStorage.getItem("persist:root"));

const user = persistRoot?.user
  ? JSON.parse(persistRoot.user)
  : null;

const TOKEN = user?.currentUser?.accessToken;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    token: `Bearer ${TOKEN}`,
  },
});