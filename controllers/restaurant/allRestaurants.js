import createHttpError from "http-errors";
import restaurantModel from "../../models/restaurantModel/restaurantModel.js";


export const allRestaurantsController = async (req, res, next) => {

    try {
        const Restaurants = await restaurantModel.find({ isPublished: true });
      
         if (!Restaurants) throw createHttpError(404, "Dont have any Published Restaurants");
        res.status(200).json(Restaurants);
    } catch (error) {
        next(error);
    }
};
