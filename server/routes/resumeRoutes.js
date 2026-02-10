import express from 'express'
import { createResume, deleteResume, getPublicResumeById, getResumeById, updateResume } from '../controlers/resumeController.js';
import protect from '../middelware/authMiddelware.js';
import upload from '../configs/multer.js';

const resumeRouter=express.Router();

resumeRouter.post('/create',protect,createResume);
resumeRouter.put('/update',protect,upload.single('image'),updateResume);
resumeRouter.delete('/delete/:resumeId',protect,deleteResume);
resumeRouter.get('/get/:resumeId',protect,getResumeById);
resumeRouter.get('/public/:resumeId',getPublicResumeById);

export default resumeRouter