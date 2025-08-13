import express from "express"
const app = express();//// Creating an Express application instance
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import userAuthRoutes from "./routes/userAuthRoute.js"
import partnerAuthRoutes from "./routes/partnerAuthRoute.js"
import restaurantRoutes from "./routes/restaurantRoute.js"
import bankInfoRoutes from "./routes/bankInfoRoute.js"
import voucherRoutes from "./routes/voucherRoute.js"
import superadminRoutes from "./routes/superAdminRoute.js"
// Importing 'cors' package to handle Cross-Origin Resource Sharing (frontend can call backend without CORS errors)
import cors from "cors"
import { Config } from "./config/index.js";
// Middleware: Converts incoming request data into JSON format
// automatically parse incoming requests with a Content-Type: application/json header,
//  and make the JSON data available in req.body.
app.use(express.json());

// Middleware: Converts URL-encoded form data into JavaScript objects
// 'extended: true' allows nested objects in form data
app.use(express.urlencoded({ extended: true }));

// Serving static files (like images) from the 'uploads' folder
// This means: http://localhost:PORT/uploads/filename.jpg will work
app.use("/uploads", express.static("uploads"));

// CORS middleware: Allow requests only from the frontend URL specified in config
app.use(cors({
    origin:Config.FRONTEND_URL    
}));

// Default route for testing the server
// When you visit http://localhost:PORT/ in a browser, you'll see this message
app.get("/", (req, res) => {
    res.json("Welcome to Restaurant Server")
})

//  http://localhost:5000/api/user/register
//  http://localhost:5000/api/user/login
app.use("/api/user", userAuthRoutes) // All user-related routes

//  http://localhost:5000/api/partner/register
//  http://localhost:5000/api/partner/login
app.use("/api/partner", partnerAuthRoutes) // All partner-related routes

//  http://localhost:5000/api/superadmin/register
//  http://localhost:5000/api/superadmin/allPartners
app.use("/api/superadmin", superadminRoutes) // All superadmin-related routes

//  http://localhost:5000/api/restaurant/add
//  http://localhost:5000/api/restaurant/allRestaurants
app.use("/api/restaurant", restaurantRoutes) // All restaurant-related routes


//  http://localhost:5000/api/bankInfo/getBankInfo
app.use("/api/bankInfo", bankInfoRoutes) // All bank information routes

//  http://localhost:5000/api/voucher/voucherCodeVerify
app.use("/api/voucher", voucherRoutes) // All voucher-related routes

// Global Error Handler (this should always be at the end)
// If any route or middleware throws an error, this will handle it
app.use(globalErrorHandler)

// Exporting 'app' so it can be used in 'server.js' to start the server
export default app