import fs from 'fs'
import imagekit from "../configs/imagekit.js"
import Resume from '../Model/resume.js';


//controller to create new resume
//POST:/api/resume/create

export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;

        //create new resume
        const newResume = await Resume.create({ userId, title })
        //return success msg
        return res.status(201).json({ message: "Resume created sucesfully", resume: newResume })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

//controller to delete resume
//DELETE:/api/resume/delete

export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        await Resume.findOneAndDelete({ userId, _id: resumeId })

        //return success msg
        return res.status(200).json({ message: "Resume deleted sucesfully" })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

//controller to get resume by id
//GET:/api/resumes/get

export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        const resume = await Resume.findOne({ userId, _id: resumeId })
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" })
        }
        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        return res.status(200).json({ resume })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

//controller to get resume by id public
//GET:/api/resume/delete

export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;

        const resume = await Resume.findOne({ public: true, _id: resumeId })
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" })
        }
        return res.status(200).json({ resume })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

//controller for updating a resume
//GET:/api/resume/update
export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;

        let resumeDataCopy;
        if(typeof resumeData === 'string'){
            resumeDataCopy=await JSON.parse(resumeData);
        }else{
            resumeDataCopy=structuredClone(resumeData)
        }

        if (image) {
            const imageBufferData=fs.createReadStream(image.path)
            const response = await imagekit.files.upload({
                file: imageBufferData,
                fileName: 'file-name.jpg',
                folder:'user-resumes',
                transformation:{
                    pre:'w-300,h-300,fo-face,z-0.75'+(removeBackground ? ',e-bgremove':'')
                }
            });
            resumeDataCopy.personal_info.image=response.url;
        }

        const resume = await Resume.findOneAndUpdate({ userId, _id: resumeId }, resumeDataCopy, { new: true })
        return res.status(200).json({ message: "saved successFully", resume })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}