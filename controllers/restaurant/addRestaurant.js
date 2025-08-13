import fs from "fs/promises";
import createHttpError from "http-errors";
import { fileTypeFromBuffer } from "file-type";
import restaurantModel from "../../models/restaurantModel/restaurantModel.js";

// Utility function to validate actual file signature (to prevent malicious file uploads)
const validateFileSignature = async (filePath) => {
    const buffer = await fs.readFile(filePath);
    const fileType = await fileTypeFromBuffer(buffer);
    // Allow only certain image formats
    if (!fileType || !["jpg", "jpeg", "png", "webp"].includes(fileType.ext)) {
        await fs.unlink(filePath); // delete invalid file
        throw createHttpError(400, "Invalid image file signature.");
    }
};

export const addRestaurantController = async (req, res, next) => {
    // Keep track of files to delete in case of errors
    let filesToClean = [];

    // Helper function to extract the relative path from a full URL
    const extractRelativePath = (fullUrlPath) => {

        // Example: 'http://localhost:5000/uploads/abc.jpg' → 'uploads/abc.jpg'
        const uploadIndex = fullUrlPath.indexOf("/uploads/");
        return uploadIndex !== -1 ? fullUrlPath.slice(uploadIndex + 1) : fullUrlPath;
    };
    try {
        const {
            restaurantName,
            restaurantAddress,
            restaurantContact,
            voucherMin,
            voucherMax,
            restaurantMenu,
            about,
            otherServices,
            cuisine,
            type,
            dietary,
            features,
        } = req.body;


        const partnerId = req.user._id;

        let coverPhotoPath = "uploads/defaultCoverPhoto.jpg";
        let ambiencePhotosPaths = [];

        // Handle cover photo upload (if provided)
        if (req.files?.coverPhoto && req.files.coverPhoto.length > 0) {
            const file = req.files.coverPhoto[0];
            coverPhotoPath = file.path.replace(/\\/g, "/");
            await validateFileSignature(coverPhotoPath);
            // Track file for cleanup in case of error
            filesToClean.push(coverPhotoPath);
        }


        // Handle ambience photo uploads (multiple files)
        if (req.files?.ambiencePhotos && req.files.ambiencePhotos.length > 0) {
            for (let file of req.files.ambiencePhotos) {
                const imagePath = file.path.replace(/\\/g, "/");
                await validateFileSignature(imagePath);
                ambiencePhotosPaths.push(imagePath);
                filesToClean.push(imagePath);
            }
        }

        const restaurantData = await restaurantModel.create({
            restaurantName,
            restaurantContact,
            restaurantAddress,
            about,
            isCompleteInfo: true,
            voucherMin,
            voucherMax,
            // cuisine:JSON.parse(cuisine),
            // type:JSON.parse(type),
            // dietary:JSON.parse(dietary),
            // features:JSON.parse(features),
            // restaurantMenu:JSON.parse(restaurantMenu),
            cuisine: cuisine ? JSON.parse(cuisine) : [],
            type: type ? JSON.parse(type) : [],
            dietary: dietary ? JSON.parse(dietary) : [],
            features: features ? JSON.parse(features) : [],
            restaurantMenu: restaurantMenu ? JSON.parse(restaurantMenu) : [],
            otherServices,
            partner: partnerId,
            coverPhoto: coverPhotoPath,
            ambiencePhotos: ambiencePhotosPaths,
        });

        res.status(201).json({
            message: "Restaurant added successfully",
            data: restaurantData,
        });

    } catch (error) {

        // In case of any error, delete uploaded files to avoid orphan files
        for (const oldPath of filesToClean) {
            const filePath = extractRelativePath(oldPath)
            // ignore file not found errors catch(()=>{ }) 
            await fs.unlink(filePath).catch(() => { });
        }
        // Pass error to global error handler
        next(error);
    }
};
