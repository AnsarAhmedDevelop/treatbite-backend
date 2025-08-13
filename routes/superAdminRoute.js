import express from "express"
import { registerController } from "../controllers/superadmin/register.js";
import { allPartnersController } from "../controllers/superadmin/allPartners.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import Roles from "../constants/index.js";
import { partnerApprovalToggleController } from "../controllers/superadmin/partnerApprovalToggle.js";
const router=express.Router();

//  http://localhost:5000/api/superadmin/register
router.post("/register", registerController);

//  http://localhost:5000/api/superadmin/allPartners
router.get("/allPartners",isAuthenticated, isAuthorized([Roles.SUPER_ADMIN]), allPartnersController);

//  http://localhost:5000/api/superadmin/partnerApprovalToggle/689795ca29efa96baf7fc79e
router.post("/partnerApprovalToggle/:id",isAuthenticated,isAuthorized([Roles.SUPER_ADMIN]), partnerApprovalToggleController);


export default router