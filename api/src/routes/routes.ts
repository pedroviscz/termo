import { Router } from "express";
import termoRoute from "./termo";
import userRoute from './user';
import loginRoute from './login'

const router = Router();

const routes: { [key: string]: Router } = {
    termo: termoRoute,
    user: userRoute,
    login: loginRoute
};

Object.keys(routes).forEach(route => {
    router.use(`/${route}`, routes[route]);
});

export default router;