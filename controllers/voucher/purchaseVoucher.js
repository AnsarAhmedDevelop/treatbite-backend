import { Config } from "../../config/index.js";
import transporter from "../../config/nodemailer.js";
import voucherModel from "../../models/restaurantModel/voucherModel.js";
import userModel from "../../models/userModel/userAuthModel.js";
import bcrypt from "bcryptjs"

export const purchaseVoucherController = async (req, res, next) => {

    const userId = req.user._id;
    const restaurantId = req.params.id;
    const {
        giftVoucherValue,
        recipientEmail,
        message,
    } = req.body;

    const pin = Math.floor(Math.random() * 9000) + 1000;

    let newPin = pin.toString();
    // console.log(newPin, "pin");

    const voucherCode = Math.floor(Math.random() * 900000) + 100000;

    // console.log(voucherCode, "voucher code");

    const hashedPin = await bcrypt.hash(newPin, 10);

    try {

        const user = await userModel.findOne({ _id: userId });
        if (!user) throw createHttpError(404, "User not found");

        const voucherData = await new voucherModel({
            giftVoucherValue,
            recipientEmail,
            message,
            restaurant: restaurantId,
            pin: hashedPin,
            donor: userId,
            voucherCode: voucherCode,
        }).save();

        // Find the voucher by its ID and populate donor and restaurant details
        const voucher = await voucherModel
            .findById(voucherData._id) // Find a single voucher document using its _id
            .populate({
                path: 'donor', // Populate the donor field from the "User" collection
                select: 'fullName email', // Include only fullName and email fields from the User document
            })
            .populate({
                path: 'restaurant',  // Populate the restaurant field from the "Restaurant" collection
                select: 'restaurantName restaurantAddress', // Include only restaurantName and restaurantAddress fields
            });

        // console.log(voucher.donor.fullName, "fullName");
        // console.log(voucher.donor.email, "email");
        // console.log(voucher.restaurant.restaurantName, "restaurantName");
        // console.log(voucher.restaurant.restaurantAddress, "restaurantAddress");

        // for sending email we use nodemailer library
        // already defined transporter
        await transporter.sendMail({         
            from: Config.SENDER_EMAIL,
            to: recipientEmail, // list of receivers
            cc: voucher.donor.email,
            subject: `Gift Voucher from ${voucher.donor.fullName}`, // Subject line
            text: `You recieved a Food Voucher Coupon from ${voucher.donor.fullName} of amount ${giftVoucherValue}.
            Restaurant Name: ${voucher.restaurant.restaurantName}.
            Restaurant Address: ${voucher.restaurant.restaurantAddress}.
            Your Voucher Code: ${voucherCode}.
            Your Secret pin: ${newPin}.
            Show your Voucher code & pin at Restaurant.
            Dont Share Your Voucher Code & Secret pin with anyone.
                    `,
        });

        res.json({ message: "payment successful. Voucher is sent on Email", voucherData });
    } catch (error) {
        next(error);
    }
};