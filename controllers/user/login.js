import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import userModel from "../../models/userModel/userAuthModel.js";
import { generateToken } from "../../services/JwtService.js";
import bcrypt from "bcryptjs";

export const loginController = async (req, res, next) => {
    try {
         // Validation on req.body by express-validator
        // error in login-validator.js file
        // middleware applied loginValidator on login route
        const result = validationResult(req);
        if (!result.isEmpty()) {
            throw createHttpError(400, result.array()[0].msg);
        }
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) throw createHttpError(401, "Invalid email or password")

        //  user.password is hashed PW saved in db
        // password is from req.body
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw createHttpError(401, "Invalid email or password")

        if (!user.isVerified) throw createHttpError(401, "Your Email is not verified. Complete your registration")

        // token generate karne ka code hai
        // ye hamara payload hai....user data ka data token may save karenge
        const userData = {
            userId: user._id,
            role: user.role
        }
        const token = generateToken(userData);

        //    const decode= verifyToken(token);
        //    console.log(decode)


        res.json({ token })


    } catch (error) {
        next(error)
    }
}