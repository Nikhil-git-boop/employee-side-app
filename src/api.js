import axios from "axios";

const API = axios.create({
  baseURL: "https://backend-simplehunt-attendance.onrender.com",
});

export default API;
