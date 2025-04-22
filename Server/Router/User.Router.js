import express from 'express';
import { LoginUser, LogoutUser, postNewAdmin, postNewUser, profileUser, putUser } from '../Controller/User.controller.js';
import ProtectedRoute from '../Service/ProtectedRoute.js';
const route = express.Router();

//user signup
route.post('/user', postNewUser);
route.put('/user', putUser);

// admin panel
route.post('/signup', postNewAdmin);
route.post('/login', LoginUser);
route.put('/profile', ProtectedRoute, profileUser);
route.get('/logout', ProtectedRoute, LogoutUser);

export default route;