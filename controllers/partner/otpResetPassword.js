import createHttpError from "http-errors";
import transporter from "../../config/nodemailer.js";
import partnerModel from "../../models/partnerModel/partnerAuthModel.js";
import { Config } from "../../config/index.js";

export const otpResetPasswordController = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) throw createHttpError(401, "Email required");
        const user = await partnerModel.findOne({ email });
        if (!user) throw createHttpError(404, "User not found");

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        // console.log(otp, "OTP");

        const expireAt = Date.now() + 15 * 60 * 1000;
        // console.log(expireAt, "expire")

        await transporter.sendMail({
            from: Config.SENDER_EMAIL,
            to: email, // list of receivers
            subject: "OTP for Reset Password", // Subject line
            text: `Your OTP is ${otp}. To reset Password use this otp.`, // plain text body
        });

        user.resetOtp = otp;
        user.resetOtpExpireAt = expireAt;
        await user.save();

        res.status(201).json({ message: "Enter OTP sent on your Email" })

    } catch (error) {
        next(error)
    }
}



