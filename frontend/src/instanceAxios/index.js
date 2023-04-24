import axios from "axios";
import Cookies from "universal-cookie";

const BASE_URL = "http://localhost:5089/api";
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 2000,
});

export default instance;
