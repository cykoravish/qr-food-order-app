import express from 'express';
import { LoginUser, LogoutUser, postNewAdmin, postNewUser, profileUser } from '../Controller/User.controller.js';
import ProtectedRoute from '../Service/ProtectedRoute.js';
const route = express.Router();

//user signup
route.post('/signup', postNewUser);

// admin panel
route.post('/admin/signup', postNewAdmin);
route.post('/login', LoginUser);
route.put('/profile', ProtectedRoute, profileUser);
route.get('/logout', ProtectedRoute, LogoutUser);

export default route;