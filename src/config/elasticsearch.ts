import { Client } from "@elastic/elasticsearch";

export const client = new Client({
  cloud: {
    id: process.env.CLOUD_ID || "",
  },
  auth: { apiKey: process.env.API_KEY || "" },
});
