import express from 'express';
// import User from './app/models/User';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new express.Router();

// routes.get('/', async (req, res) => {
//   const user = await User.create({
//     name: 'Carlos',
//     email: 'nobregacarlosjr@gmail.com',
//     password_hash: 'UIAHSIaus',
//   });

//   return res.json(user);
// });

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

export default routes;
