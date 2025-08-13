import { Config } from "../../config/index.js";
import transporter from "../../config/nodemailer.js";
import partnerModel from "../../models/partnerModel/partnerAuthModel.js";

export const partnerApprovalToggleController = async (req, res, next) => {
    const id = req.params.id;

    try {
        let data = await partnerModel.findById(id);
        if (data.isApproved) {
            data.isApproved = false;
            data = await data.save();
            await transporter.sendMail({
                from: Config.SENDER_EMAIL,
                to: data.email,
                subject: "Your Account is Blocked", // Subject line
                text: `Your Account in Treatebite is Blocked. Contact to Our Team.`, // plain text body
            });
            return res.status(200).json({
                message: "Restaurant Owner is Blocked"
            });

        } else {
            data.isApproved = true;
            data = await data.save();
            await transporter.sendMail({
                from: Config.SENDER_EMAIL,
                to: data.email,
                subject: "Your Registration is Approved", // Subject line
                text: `Your Account in Treatebite is Approved. You can login now.`, // plain text body
            });
            return res.status(200).json({
                message: "Restaurant Owner is Approved"
            });
        }
    } catch (error) {
        next(error);
    }
};