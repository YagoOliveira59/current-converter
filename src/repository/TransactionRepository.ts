import moment from "moment";
import db from "../database/database";
import pinoConfig from "../utils/logger";

const logger = pinoConfig;

interface SaveTransitionResquest {
  userId: number;
  currencyOrigin: string;
  amountOrigin: number;
  currencyDestiny: string;
}

interface SaveTransitionResponse {
  id: number;
  userId: number;
  currencyOrigin: string;
  amountOrigin: number;
  currencyDestiny: string;
  amountDestiny: number;
  rate: number;
  createdAt: string;
}

export class TransactionRepository {
  async create(
    transaction: SaveTransitionResquest,
    rate: number,
    amountDestiny: number
  ) {
    return new Promise<SaveTransitionResponse>((resolve, reject) => {
      const sql =
        "INSERT INTO transitions (userId, currencyOrigin, amountOrigin, currencyDestiny, rate, createdAt) VALUES (?, ?, ?, ?, ?, ?)";
      db.run(
        sql,
        [
          transaction.userId,
          transaction.currencyOrigin,
          transaction.amountOrigin.toFixed(2),
          transaction.currencyDestiny,
          rate,
          moment().utc(true).toISOString(),
        ],
        function (err) {
          if (err) {
            logger.error(err);
            reject();
          }
          resolve({
            id: this.lastID,
            userId: transaction.userId,
            currencyOrigin: transaction.currencyOrigin,
            amountOrigin: transaction.amountOrigin,
            currencyDestiny: transaction.currencyDestiny,
            amountDestiny: amountDestiny,
            rate: rate,
            createdAt: moment().utc(true).format(),
          });
        }
      );
    });
  }
  async getById(id: number) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM transitions WHERE userId = ?";
      db.all(sql, [id], (err, rows) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(rows);
        }
      });
    });
  }
  async getAll() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM transitions";
      db.all(sql, (err, rows) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(rows);
        }
      });
    });
  }
}
