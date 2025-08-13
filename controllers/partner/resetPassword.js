import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import partnerModel from "../../models/partnerModel/partnerAuthModel.js";

export const resetPasswordController = async (req, res, next) => {
    try {
        const { resetOtp, email, password } = req.body;
        if (!email || !resetOtp || !password) throw createHttpError(401, "Email, OTP and Password required");
        const user = await partnerModel.findOne({ email });
        if (!user) throw createHttpError(404, "User not found");
        
        if (user.resetOtp !== resetOtp || user.resetOtp === '') {
            throw createHttpError(401, "Invalid OTP");
        }

        if (user.resetOtpExpireAt < Date.now()) {
            throw createHttpError(401, "OTP expired");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;
        await user.save();
        res.json({ message: "Password Reset Successfully." })
    } catch (error) {
        next(error)
    }
}

