import createHttpError from "http-errors";
import userModel from "../../models/userModel/userAuthModel.js";

export const verifyEmailController = async (req, res, next) => {
    try {
        const { email, verifyOtp } = req.body;
        if (!email || !verifyOtp) throw createHttpError(401, "Email and OTP required");
        // we get all information of user from database if user exist
        const user = await userModel.findOne({ email });
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
        res.json({ message: "Email verified Successfully." })
    } catch (error) {
        next(error)
    }
}