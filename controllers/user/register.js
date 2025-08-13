import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import userModel from "../../models/userModel/userAuthModel.js";
import bcrypt from "bcryptjs";
import transporter from "../../config/nodemailer.js";
import { Config } from "../../config/index.js";

 export const registerController = async (req, res, next) => {
    try {
        // Validation on req.body by express-validator
        // error in register-validator.js file
        // middleware applied registerValidator on register route
        const result = validationResult(req);
        // agar result.isEmpty nahi hai...error hai..tu first error send karo
        if (!result.isEmpty()) {
            throw createHttpError(400, result.array()[0].msg);
        }
        // destructure all input values from req.body....
        const { fullName, email, password, role } = req.body;

        //userModel is mongoose model...model use for any operation in db
        //findOne is also mongoose sentax used for finding any matching document
      
        const userExist = await userModel.findOne({ email });
        // if (userExist) return res.status(409).json({ message: "Email Already Exist" })
       // http-errors library to create errors...
        // if userExist create error and it will not execute next code..it will break
        if (userExist) throw createHttpError(409, "Email Already Exist")

        // we will not save original password in db
        // use bcrypt library to hashed Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // generate OTP for Email verfication
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        // console.log(otp, "OTP");

        // create expire time for otp....24hr
        const expireAt = Date.now() + 24 * 60 * 60 * 1000;

        
        // Define an array of background colors for avatar
        const backgroundColors = [
            "e57f7f",
            "69a69d",
            "7a9461",
            "98b8e1",
            "e0d084",
            "516087",
            "ab9f8e",
            "c150ad",
            "be94eb",
            "a6a7ae",
        ];

        // Choose a random background color from the array
        const randomBackgroundColor =
            backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
        // create is mongoose syntax used for creating user in database
        // it is db operation so we have to use await
        await userModel.create({
        
            fullName,
            email,
            password: hashedPassword,
            role,
            verifyOtp: otp,
            verifyOtpExpireAt: expireAt,
            avatar: `https://ui-avatars.com/api/?name=${fullName}&&color=fff&&background=${randomBackgroundColor}&&rounded=true&&font-size=0.44`
        })

        // for sending email we use nodemailer library
        // already defined transporter
        await transporter.sendMail({
            from: Config.SENDER_EMAIL,
            to: email, // list of receivers
            subject: "Email Verification", // Subject line
            text: `Your OTP is ${otp}. Verify Your account using this OTP.`, // plain text body
        });

        // sending response
        res.status(201).json({ message: "Enter OTP sent on your Email" })

    } catch (error) {
        // res.status(500).json({ message: "internal server error", error: error.message })
        // error is sent to global error handler..next middleware..app.use(globalErrorHandler)
        next(error)
    }
}

