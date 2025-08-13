import nodemailer from "nodemailer"
import {Config} from "../config/index.js"

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "ansarahmedn@gmail.com",
//     pass: "odvw puvp cpjx eume",
//   },
// });
const transporter = nodemailer.createTransport({
      host: Config.HOST,
      service: Config.SERVICE,
      port: Number(Config.EMAIL_PORT),
      secure: Boolean(Config.SECURE),
      auth: {
        user: Config.SENDER_EMAIL,
        pass: Config.PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

export default transporter