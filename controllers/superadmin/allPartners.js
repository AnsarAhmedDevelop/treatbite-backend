import partnerModel from "../../models/partnerModel/partnerAuthModel.js";



// export const allPartnersController = async (req, res, next) => {

//     try {
//         const partners = await partnerModel.find({role: "Partner"}).select("-resetOtpExpireAt -resetOtpExpireAt -resetOtp -verifyOtpExpireAt -verifyOtp -password -updatedAt -createdAt -__v");
//         res.status(200).json(partners);
//     } catch (error) {
//         next(error);
//     }
// };

export const allPartnersController = async (req, res, next) => {
    try {
        const result = await partnerModel.aggregate([
            { $match: { role: "Partner" } },
             {
                $project: {
                    password: 0,
                    verifyOtp: 0,
                    verifyOtpExpireAt: 0,
                    resetOtp: 0,
                    resetOtpExpireAt: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    __v: 0
                }
            },
            {
                $lookup: {
                    from: "restaurants", // collection name in MongoDB (lowercase plural of model)
                    localField: "_id",
                    foreignField: "partner",
                    pipeline: [
                        { $project: { _id: 0, restaurantName: 1, restaurantAddress: 1, isPublished: 1 } }
                    ],
                    as: "restaurants"
                }
            }
        ]);

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};