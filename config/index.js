// Importing the 'dotenv' package to load environment variables from a .env file
import dotenv from "dotenv";

// This method reads the .env file and adds the variables into process.env
dotenv.config();

// Destructuring environment variables from process.env
const {
  PORT,
  MONGO_URI,
  FRONTEND_URL,
  MAIN_DOMAIN,
  HOST,
  SERVICE,
  EMAIL_PORT,
  SECURE,
  SENDER_EMAIL,
  PASS,
} = process.env;

// Creating a Config object to store all environment variables in one place
// This makes it easy to import and use them anywhere in the project
export const Config = {
  PORT,
  MONGO_URI,
  FRONTEND_URL,
  MAIN_DOMAIN,
  HOST,
  SERVICE,
  EMAIL_PORT,
  SECURE,
  SENDER_EMAIL,
  PASS,
}