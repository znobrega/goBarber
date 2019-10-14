import express from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new express.Router();


routes.post('/users', UserController.store);
routes.post('/  ', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

export default routes;
