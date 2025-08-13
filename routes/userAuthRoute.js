import express from "express"

import userRegisterValidator from "../validators/userRegister-validator.js";
import { registerController } from "../controllers/user/register.js";
import { verifyEmailController } from "../controllers/user/verifyEmail.js";
import { loginController } from "../controllers/user/login.js";
import userLoginValidator from "../validators/userLogin-validator.js";
import { profileController } from "../controllers/user/profile.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { uploadAvatar } from "../middlewares/updateAvatar.js";
import userProfileUpdateValidator from "../validators/userProfileUpdate-validator.js";
import { updateProfileController } from "../controllers/user/updateProfile.js";
import { otpResetPasswordController } from "../controllers/user/otpResetPassword.js";
import userResetPasswordValidator from "../validators/userResetPassword-validator.js";
import { resetPasswordController } from "../controllers/user/resetPassword.js";

const  router= express.Router();

// complete route...
//  http://localhost:5000/api/user/register
// Middleware sequence: Validate registration data → Run registration controller
router.post("/register",userRegisterValidator, registerController);

router.post("/verifyEmail", verifyEmailController);

//  http://localhost:5000/api/user/login
router.post("/login",userLoginValidator, loginController)

router.get("/profile",isAuthenticated, profileController)

// Full URL: http://localhost:5000/api/user/updateProfile
// Middleware sequence:
//  1. uploadAvatar → Uploads new profile picture if provided
//  2. userProfileUpdateValidator → Validates updated profile data....using express-validator
//  3. isAuthenticated → Ensures the user is logged in
//  4. updateProfileController → Saves changes in database
router.put("/updateProfile",uploadAvatar, userProfileUpdateValidator, isAuthenticated, updateProfileController)

router.post("/otpResetPassword",otpResetPasswordController)

router.post("/resetPassword",userResetPasswordValidator, resetPasswordController)

// Exporting router so it can be used in main app.js
export default router