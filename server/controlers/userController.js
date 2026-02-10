import User from "../Model/User.js";
import Resume from "../Model/resume.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return token;
}

//controller for user register
//POST:/api/users/register

export const registerdUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //check if required details are present
        if (!name || !email || !password) {
            return res.status(400).json({ message: "missing rquired feilds" });
        }
        //check for user already exsist or not

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "user already exsist" });
        }
        //create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });

        //return sucess message
        const token = generateToken(newUser._id);
        newUser.password = undefined;

        return res.status(201).json({ message: "user created sucessfully", token, user: newUser });
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

//controller for user login
//POST:/api/users/login

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check for user already exsist or not

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or  password" });
        }

        // check password
        if (!user.comparePassword(password)) {
            return res.status(400).json({ message: "Invalid email or  password" });
        }

        //return sucess message
        const token = generateToken(user._id);
        user.password = undefined;

        return res.status(200).json({ message: "Login sucessfull", token, user });
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

//controller for getting user by id
//GET:/api/users/data

export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;
        //check if user exsist
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        //returm user
        user.password = undefined;
        return res.status(200).json({ user });
    } catch (error) {  
        return res.status(400).json({ message: error.message })
    }
}

//controller for getting user resume
//GET:/api/users/resumes
export const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId;
        const resumes = await Resume.find({ userId });
        return res.status(200).json({ resumes });
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}