import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import fs from "fs/promises";
import { fileTypeFromBuffer } from "file-type";
import userModel from "../../models/userModel/userAuthModel.js";

// // Binary signature check
const validateFileSignature = async (filePath) => {
    const buffer = await fs.readFile(filePath);
    const fileType = await fileTypeFromBuffer(buffer);
    if (!fileType || !["jpg", "jpeg", "png"].includes(fileType.ext)) {
        await fs.unlink(filePath);
        throw createHttpError(401, "File signature mismatch. Invalid image.");
    }
};

export const updateProfileController = async (req, res, next) => {
  let avatarPath = null;

  if (req.file) {
    avatarPath = req.file.path.replace(/\\/g, "/");//Replace all \ with /
   
    try {
      await validateFileSignature(avatarPath);
    } catch (error) {
      return next(error);
    }
  }

  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw createHttpError(400, result.array()[0].msg);
    }

    const userId = req.user._id;
    const { fullName, email } = req.body;
    // console.log(req.body,"req body");
    // console.log(firstName,"firstName");

    const user = await userModel.findById(userId);
    if (!user) throw createHttpError(404, "User not found");

    if (email && user.email !== email) {
      const emailExist = await userModel.findOne({ email });
      if (emailExist) throw createHttpError(409, "Email already in use");
    }

    
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (avatarPath) user.avatar = avatarPath;

    await user.save();

    res.json({
      message: "Update Profile Successfully",
      user: {
        fullName: user.fullName,
        avatar: user.avatar,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
