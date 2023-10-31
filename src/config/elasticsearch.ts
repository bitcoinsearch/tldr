import { Client } from "@elastic/elasticsearch";
import { API_KEY, CLOUD_ID } from "./process";

export const client = new Client({
  cloud: {
    id: CLOUD_ID || "",
  },
  auth: { apiKey: API_KEY || "" },
});
