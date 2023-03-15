import fs from "fs";
import config from "./config";
import express from "express";
import pinoConfig from "./utils/logger";
import index from "./routes/index";
import db from "./database/database";
import transactions from "./routes/transactions";

const app = express();
const logger = pinoConfig;

db.exec(fs.readFileSync(__dirname + "/sql/schema.sql").toString());
app.use(express.json());
app.use("/v1/", index);
app.use("/v1/transactions", transactions);

app.listen(config.port, () => {
  logger.info(`listening port ${config.port}`);
  logger.info(`token ${config.token}`);
});
