// import createHttpError from "http-errors";

import partnerModel from "../../models/partnerModel/partnerAuthModel.js";

export const profileController = async (req, res, next) => {
    const id = req.user._id;
    // console.log(id,"coming from token..from isAuthenticated")
    try {
        // const userId = req.params.id
        //    console.log(userId,"user id")
        // if (id !== userId) throw createHttpError(401, "Unauthorized")
        const user = await partnerModel.findById({ _id: id }).select(" -password -__v -createdAt -updatedAt")
        res.json(user)
    } catch (error) {
        next(error)
    }
}

