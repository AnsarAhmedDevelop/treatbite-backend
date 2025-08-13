import express from "express";
import partnerRegisterValidator from "../validators/partnerRegister-validator.js";
import { registerController } from "../controllers/partner/register.js";
import { verifyEmailController } from "../controllers/partner/verifyEmail.js";
import { loginController } from "../controllers/partner/login.js";
import userLoginValidator from "../validators/userLogin-validator.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { profileController } from "../controllers/partner/profile.js";
import { uploadAvatar } from "../middlewares/updateAvatar.js";
import partnerProfileUpdateValidator from "../validators/partnerProfileUpdate-validator.js";
import { updateProfileController } from "../controllers/partner/updateProfile.js";
import { otpResetPasswordController } from "../controllers/partner/otpResetPassword.js";
import { resetPasswordController } from "../controllers/partner/resetPassword.js";
const router=express.Router();

//  http://localhost:5000/api/partner/register
router.post("/register", partnerRegisterValidator, registerController)
router.post("/verifyEmail", verifyEmailController);

//  http://localhost:5000/api/partner/login
router.post("/login",userLoginValidator, loginController);

// changes
// router.get("/profile/:id",isAuthenticated, profileController);
router.get("/profile",isAuthenticated, profileController);
router.put("/updateProfile",uploadAvatar, partnerProfileUpdateValidator, isAuthenticated, updateProfileController)
router.post("/otpResetPassword",otpResetPasswordController)
router.post("/resetPassword",partnerProfileUpdateValidator, resetPasswordController)


export default router;