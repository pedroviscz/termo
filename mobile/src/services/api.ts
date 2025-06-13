import axios from 'axios'
import { GameData, TermoPayload } from "../interfaces/GameData";
import { API_BASE_URL } from '../config/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;