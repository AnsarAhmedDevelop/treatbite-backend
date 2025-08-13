import createHttpError from "http-errors";
import { verifyToken } from "../services/JwtService.js";
import partnerModel from "../models/partnerModel/partnerAuthModel.js";



export const isAuthenticated=(req, res, next)=>{

    const authHeader=req.headers.authorization;
    // console.log(authHeader,"auth header")
    if(authHeader === "Bearer null" || authHeader=== "Bearer undefined"){
          throw createHttpError(401,"unAuthorized")
    }    
    //   console.log(authHeader,"auth header")  
    const token=authHeader.split(" ")[1];
    // console.log(token,"token")   
    // const token = req.cookies.token;
if (!token) throw createHttpError(401, "Unauthorized");

    try {
        const decoded=verifyToken(token);
        // console.log(decoded,"decoded")
        const {userId} =decoded;
        const user={
            _id:userId
        }
        req.user=user;
        // console.log(req.user,"req user")
         next()
    } catch (error) {
        next(error)
    }
}

export const isAuthorized= (roles)=>{
   return async (req,res,next)=>{
    try {
        const userId=req.user._id;
        // console.log(userId,"user Id")
      const userRole= await partnerModel.findById(userId).select("role");
        // console.log(userRole)
        if(!roles.includes(userRole.role)){
            throw createHttpError(401,"Unauthorized to Access")
        }

        next()        
    } catch (error) {
        next(error)
    }
   }
}