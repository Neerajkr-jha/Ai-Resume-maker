import express from 'express'
import { getUserById, getUserResumes, loginUser, registerdUser } from '../controlers/userController.js';
import protect from '../middelware/authMiddelware.js';

const userRouter=express.Router();

userRouter.post('/register',registerdUser);
userRouter.post('/login',loginUser);
userRouter.get('/data',protect,getUserById);
userRouter.get('/resumes',protect,getUserResumes);

export default userRouter;