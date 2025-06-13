import api from './api';
import { TermoPayload } from '../interfaces/GameData';

interface Params {
  route: keyof TermoPayload
  data: TermoPayload
}
export const createGameRecord = async ({route, data}: Params) => {
  const response = await api.post(`${route}`, data);
  return response.data;
};

export const updateGameRecord = async ({route, data}: Params) => {
  const response = await api.put(`${route}`, data);
  return response.data
}