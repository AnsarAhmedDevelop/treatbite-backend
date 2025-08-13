import createHttpError from "http-errors";
import restaurantModel from "../../models/restaurantModel/restaurantModel.js";


export const partnerRestaurantsController = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const Restaurants = await restaurantModel.find({ partner: userId });
        // console.log(Restaurants);
         if (!Restaurants) throw createHttpError(404, "Dont have any Restaurant");
        res.status(200).json(Restaurants);
    } catch (error) {
        next(error);
    }
};
