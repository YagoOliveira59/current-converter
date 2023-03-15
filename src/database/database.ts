import config from "../config";
import { Database } from "sqlite3";
import pinoConfig from "../utils/logger";

const logger = pinoConfig;

const db = new Database(config.db, (err) => {
  if (err) {
    logger.error(err.message);
    return;
  }
  logger.info(`Connected to the database ${config.db}`);
});

export default db;
