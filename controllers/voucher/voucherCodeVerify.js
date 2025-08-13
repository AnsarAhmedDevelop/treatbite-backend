import createHttpError from "http-errors";
import voucherModel from "../../models/restaurantModel/voucherModel.js";
import bcrypt from "bcryptjs"

export const voucherCodeVerifyController = async (req, res, next) => {

    const { voucherId, voucherPin } = req.body;

    const newVoucherPin = voucherPin.toString();

    try {
        let data = await voucherModel.findById(voucherId);

        const match= await bcrypt.compare(newVoucherPin, data.pin);
       

        if (!match) throw createHttpError(401, "pin is incorrect");

        data.status = "visited";
        data.visitedDate = Date.now();
        data.pin=""
        data = await data.save();
        res.status(200).json({ message: "voucher verified successfully", data });
    } catch (error) {
        next(error);
    }
};