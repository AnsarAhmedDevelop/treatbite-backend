import createHttpError from "http-errors";

import partnerModel from "../../models/partnerModel/partnerAuthModel.js";
import transporter from "../../config/nodemailer.js";
import { Config } from "../../config/index.js";

export const verifyEmailController = async (req, res, next) => {
    try {
        const { email, verifyOtp } = req.body;
        if (!email || !verifyOtp) throw createHttpError(401, "Email and OTP required");
        // we get all information of user from database if user exist
        const user = await partnerModel.findOne({ email });
        if (!user) throw createHttpError(404, "User not found");
        // console.log(user.verifyOtp,"db otp");
        // console.log(verifyOtp,"req body otp");

        //user.verifyOtp from db and verifyOtp from req.body
        // otp saved in db not equal to req.body otp  OR db otp is empty
        if (user.verifyOtp !== verifyOtp || user.verifyOtp === '') {
            throw createHttpError(401, "Invalid OTP");
        }

        // current time greater then expire time that means OTP expired
        if (user.verifyOtpExpireAt < Date.now()) {
            // if otp expired..delete user Data from db
            await userModel.findByIdAndDelete(user._id);
            throw createHttpError(401, "OTP expired. Register Again");
        }
        // update user data 
        user.isVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;
        // save() mongoose syntax used for saving user information
        await user.save();

          const superAdmin = await partnerModel.findOne({ role:"SuperAdmin" });
        // for sending email to superadmin
        // already defined transporter
        if(superAdmin){
            await transporter.sendMail({
            from: Config.SENDER_EMAIL,
            to: superAdmin.email, // list of receivers
            subject: "New Partner Registered", // Subject line
            text: `New Partner is Registered in Treatebite Plateform.
            Partner Details are as follows..
            Name: ${user.fullName}
            Email: ${user.email}
            Contact: ${user.contact}
            Approve or Block from dashboard...
            `, // plain text body
        });

        }

        res.json({ message: "Email verified Successfully." })
    } catch (error) {
        next(error)
    }
}