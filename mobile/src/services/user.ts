import api from "./api";
import { IUserDocument } from "../interfaces/User";

export const createUser = async (data: IUserDocument) => {
    const response = await api.post('/user', data);
    return response.data;
}

export const getUserByLogin = async ({username, password}: { username: string, password: string }) =>{
    const response = await api.post('/login', {username, password});
    return response;
}

export const registerDeviceId = async (username: string, devId: string) =>{
    const response = await api.post('/user/deviceId', { username, deviceId: devId })
    return response.data
}