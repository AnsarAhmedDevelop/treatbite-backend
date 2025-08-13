import express from "express";
import Roles from "../constants/index.js";
import { addRestaurantController } from "../controllers/restaurant/addRestaurant.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { uploadRestaurantImages } from "../middlewares/restaurantUpload.js";
import { updateRestaurantController } from "../controllers/restaurant/updateRestaurant.js";
import { allRestaurantsController } from "../controllers/restaurant/allRestaurants.js";
import { partnerRestaurantsController } from "../controllers/restaurant/partnerRestaurants.js";
import { publishToggleRestaurantController } from "../controllers/restaurant/publishToggleRestaurant.js";
import { singleRestaurantController } from "../controllers/restaurant/singleRestaurant.js";


const router=express.Router();

//  http://localhost:5000/api/restaurant/add
router.post("/add",isAuthenticated,isAuthorized([Roles.PARTNER]),  uploadRestaurantImages, addRestaurantController)
router.put("/update/:id",isAuthenticated,isAuthorized([Roles.PARTNER]),  uploadRestaurantImages, updateRestaurantController)

// publish and unpublish a Restaurant
router.post("/publishToggleRestaurant/:id",isAuthenticated,isAuthorized([Roles.PARTNER]), publishToggleRestaurantController);

// get all restaurants general
//  http://localhost:5000/api/restaurant/allRestaurants
router.get("/allRestaurants", allRestaurantsController);

// get all restaurants of particular partner
router.get("/PartnerRestaurants",isAuthenticated,isAuthorized([Roles.PARTNER, Roles.SUPER_ADMIN]), partnerRestaurantsController);

// get single  Restaurant
router.get("/getrestaurant/:id", singleRestaurantController);

export default router;