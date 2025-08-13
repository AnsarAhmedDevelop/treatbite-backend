// For working with the file system (async/await version)
import fs from "fs/promises";
import createHttpError from "http-errors";
import { fileTypeFromBuffer } from "file-type";
import restaurantModel from "../../models/restaurantModel/restaurantModel.js";

/* 
  Utility Function: Validate uploaded image file
  - Reads the file from disk into a buffer
  - Checks the actual file signature (not just the file extension)
  - Allows only JPG, JPEG, and PNG
  - Deletes the file immediately if it's invalid
*/
const validateFileSignature = async (filePath) => {
    const buffer = await fs.readFile(filePath);
    const fileType = await fileTypeFromBuffer(buffer);
    if (!fileType || !["jpg", "jpeg", "png"].includes(fileType.ext)) {
        await fs.unlink(filePath); // delete invalid file
        throw createHttpError(400, "Invalid image file type");
    }
};

export const updateRestaurantController = async (req, res, next) => {
    // Keep track of newly uploaded files (for cleanup if error occurs)
    let filesToClean = [];

    // Helper: Convert a full URL path to relative path (so we can delete file from local storage)
    // Example: 'http://localhost:5000/uploads/abc.jpg' → 'uploads/abc.jpg'
    const extractRelativePath = (fullUrlPath) => {
        // Example: 'http://localhost:5000/uploads/abc.jpg' → 'uploads/abc.jpg'
        const uploadIndex = fullUrlPath.indexOf("/uploads/");
        return uploadIndex !== -1 ? fullUrlPath.slice(uploadIndex + 1) : fullUrlPath;
    };
    try {
        const restaurantId = req.params.id;

        // Find restaurant
        const restaurant = await restaurantModel.findById(restaurantId);
        if (!restaurant) throw createHttpError(404, "Restaurant not found");
        // console.log(req.user._id.toString(), "req user id")
        // console.log(restaurant.partner.toString(), "restaurant db user id")
        // Check if the restaurant belongs to the logged-in user
        if (restaurant.partner.toString() !== req.user._id.toString()) {
            throw createHttpError(403, "Unauthorized to update this restaurant");
        }

        // Destructure updated fields from request body
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
      

        // Update basic fields if present
        if (restaurantName) restaurant.restaurantName = restaurantName;
        if (restaurantAddress) restaurant.restaurantAddress = restaurantAddress;
        if (restaurantContact) restaurant.restaurantContact = restaurantContact;
        if (voucherMin) restaurant.voucherMin = voucherMin;
        if (voucherMax) restaurant.voucherMax = voucherMax;
        if (restaurantMenu) restaurant.restaurantMenu = JSON.parse(restaurantMenu);
        if (about) restaurant.about = about;
        if (otherServices) restaurant.otherServices = otherServices;
        if (cuisine) restaurant.cuisine =JSON.parse(cuisine);
        if (type) restaurant.type = JSON.parse(type);
        if (dietary) restaurant.dietary = JSON.parse(dietary);
        if (features) restaurant.features = JSON.parse(features);


           /* 
           Handle Cover Photo Update 
           - Validate file type
           - Delete old cover photo (if exists and not the default)
           - Save new file path
        */
        if (req.files?.coverPhoto && req.files.coverPhoto.length > 0) {
            const file = req.files.coverPhoto[0];
            // console.log(file,"cover file")
            const imagePath = file.path.replace(/\\/g, "/");
            await validateFileSignature(imagePath);
            filesToClean.push(imagePath);

            // Delete old cover photo (skip if it's the default image)
            if (
                restaurant.coverPhoto &&
                restaurant.coverPhoto !== `${process.env.BACKEND_URL}/uploads/defaultCoverPhoto.jpg`
            ) {
                const filePath = extractRelativePath(restaurant.coverPhoto)
                await fs.unlink(filePath).catch(() => { });
            }
            // console.log(imagePath,"image path cover")
            restaurant.coverPhoto = imagePath;
        }

           /* 
           Handle Ambience Photos Update 
           - Multiple images allowed
           - Validate all files
           - Delete old ambience photos
        */
        if (req.files?.ambiencePhotos && req.files.ambiencePhotos.length > 0) {
            const ambiencePaths = [];

            for (const file of req.files.ambiencePhotos) {
                // Normalize path for cross-platform compatibility
                const imagePath = file.path.replace(/\\/g, "/");
                await validateFileSignature(imagePath);
                ambiencePaths.push(imagePath);
                filesToClean.push(imagePath);
            }

               // Delete old ambience photos if any exist
            if (restaurant.ambiencePhotos.length > 0) {
                for (const oldPath of restaurant.ambiencePhotos) {
                    const filePath = extractRelativePath(oldPath)
                    await fs.unlink(filePath).catch(() => { });
                }
            }
            restaurant.ambiencePhotos = ambiencePaths;            
        }
      
        restaurant.isCompleteInfo = true;
          // Save updated restaurant details
        await restaurant.save();

        res.json({
            message: "Restaurant updated successfully",
            restaurant,
        });
    } catch (error) {
         // Cleanup uploaded files in case of an error
        for (const oldPath of filesToClean) {
            const filePath = extractRelativePath(oldPath)
            await fs.unlink(filePath).catch(() => { });
        }
        // Pass error to global error handler
        next(error);
    }
};
