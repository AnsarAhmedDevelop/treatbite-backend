import express from "express";
import Roles from "../constants/index.js";
import { updateBankInfoController } from "../controllers/bank/update.js";
import { getBankInfoController } from "../controllers/bank/getBankDetail.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router=express.Router();

//  http://localhost:5000/api/bankInfo/getBankInfo
router.get("/getBankInfo",isAuthenticated,isAuthorized([Roles.PARTNER]), getBankInfoController)
router.put("/update/:id",isAuthenticated,isAuthorized([Roles.PARTNER]), updateBankInfoController)

export default router;