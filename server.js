import app from "./app.js"
import dotenv from "dotenv"
dotenv.config();
import mongoose from "mongoose"
import { Config } from "./config/index.js";

const PORT = Config.PORT || 5000

mongoose.connect(Config.MONGO_URI)
    .then(() => {
        console.log("dB Connected")
        app.listen(PORT, () => {
            console.log(`server is running on http://localhost:${PORT}`)
        })

    })
    .catch(() => { console.log("Connection error") })



