import bankInfoModel from "../../models/bankInfoModel/bankInfoModel.js";


export const updateBankInfoController = async (req, res, next) => {
    try {
        const userId = req.user._id;
        //bank id
        const id = req.params.id;
        const { accountName, accountNumber, ifscCode } = req.body;
        const bankData = await bankInfoModel.findById(id);
        if (bankData.partnerId !== userId) throw createHttpError(401, "Not allowed to update");

        if (accountName) bankData.accountName = accountName;
        if (accountNumber) bankData.accountNumber = accountNumber;
        if (ifscCode) bankData.ifscCode = ifscCode;
        bankData.isBankInfo = true;
        await bankData.save();
        res.status(200).json({ message: "Bank Details Updated Successfully", bankData });

    } catch (error) {
        next(error);
    }
};
