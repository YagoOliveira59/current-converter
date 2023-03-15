import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/.env" });

export default {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  token: process.env.API_TOKEN || "",
  db: process.env.DB_NAME || ":memory:",
};
