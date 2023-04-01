import axios from "axios";

export const webApi = axios.create({
  baseURL: 'http://localhost:4000/api'
})