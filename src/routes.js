import express from 'express';
// import User from './app/models/User';

import UserController from './app/controllers/UserController';

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

export default routes;
