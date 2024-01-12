import { config } from "dotenv";

config();

export const API_KEY = process.env.API_KEY;
export const CLOUD_ID = process.env.CLOUD_ID;
export const INDEX = process.env.INDEX;
export const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
export const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID || "";

if (!API_KEY) {
  throw new Error("API_KEY not found");
}
if (!CLOUD_ID) {
  throw new Error("CLOUD_ID not found");
}
if (!INDEX) {
  throw new Error("INDEX not found");
}
if (!MAILCHIMP_API_KEY) {
  throw new Error("MAILCHIMP_API_KEY not found");
}
