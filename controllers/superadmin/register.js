import partnerModel from "../../models/partnerModel/partnerAuthModel.js";
import bcrypt from "bcryptjs";

export const registerController = async (req, res, next) => {
    try {
        const { fullName, email, password, role } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await partnerModel.create({
            fullName,
            email,
            password: hashedPassword,
            role,
            isApproved:true,
            isVerified:true
        })
        res.status(201).json({ message: "Superadmin Account created Successfully" })

    } catch (error) {
        next(error)
    }
}