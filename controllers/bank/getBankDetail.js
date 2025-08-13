import bankInfoModel from "../../models/bankInfoModel/bankInfoModel.js";

export const getBankInfoController = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const bankInfo = await bankInfoModel.find({ partnerId: userId }).select(
            "-updatedAt -__v -createdAt"
        );
        if (!bankInfo) throw createHttpError(401, "Not allowed");
        res.status(200).json(bankInfo);
    } catch (error) {
        next(error);
    }
};