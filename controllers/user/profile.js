import createHttpError from "http-errors";
import userModel from "../../models/userModel/userAuthModel.js";

export const profileController = async (req, res, next) => {
    const id = req.user._id;
    // console.log(id,"coming from token..from isAuthenticated")
    try {     
        const user = await userModel.findById({ _id: id }).select(" -password -__v -createdAt -updatedAt")
        res.json(user)
    } catch (error) {
        next(error)
    }
}