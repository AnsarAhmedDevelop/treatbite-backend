import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { generateToken } from "../../services/JwtService.js";
import partnerModel from "../../models/partnerModel/partnerAuthModel.js";
import { Config } from "../../config/index.js";

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
        const user = await partnerModel.findOne({ email })
        if (!user) throw createHttpError(401, "Invalid email or password")

        //  user.password is hashed PW saved in db
        // password is from req.body
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw createHttpError(401, "Invalid email or password")

        if (!user.isVerified) throw createHttpError(401, "Your Email is not verified. Complete your registration")

        if (!user.isApproved) throw createHttpError(401, "Your Registration is not Approved or Blocked. Check Your Email.")

        // token generate karne ka code hai
        // ye hamara payload hai....user data ka data token may save karenge
        const userData = {
            userId: user._id,
            role: user.role
        }
        const token = generateToken(userData);

        


        res.json({ token,role:user.role })
        


    } catch (error) {
        next(error)
    }
}