import express from "express";
import Roles from "../constants/index.js";

import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { purchaseVoucherController } from "../controllers/voucher/purchaseVoucher.js";
import { voucherCodeVerifyController } from "../controllers/voucher/voucherCodeVerify.js";
import { getRestaurantVouchersController } from "../controllers/voucher/getrestaurantVouchers.js";
import { voucherSearchController } from "../controllers/voucher/voucherSearch.js";

const router=express.Router();

// http://localhost:5000/api/voucher/voucherPurchase/689795ca29efa96baf7fc79e
router.post("/voucherPurchase/:id",isAuthenticated, purchaseVoucherController)

//  http://localhost:5000/api/voucher/voucherCodeVerify
router.post("/voucherCodeVerify", isAuthenticated,isAuthorized([Roles.PARTNER]), voucherCodeVerifyController)

router.get("/restaurantVouchers/:id", isAuthenticated,isAuthorized([Roles.PARTNER]), getRestaurantVouchersController)

router.post("/vouchersearch/:key", isAuthenticated,isAuthorized([Roles.PARTNER]), voucherSearchController)

export default router;