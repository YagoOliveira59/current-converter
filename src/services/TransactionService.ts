import { Request } from "express";
import pinoConfig from "../utils/logger";
import { Transaction } from "../entities/transactions";
import { TransactionRepository } from "../repository/TransactionRepository";
import { RateService } from "./RateService";

const logger = pinoConfig;

interface SaveTransitionResquest {
  userId: number;
  currencyOrigin: string;
  amountOrigin: number;
  currencyDestiny: string;
}
function validator(transaction: SaveTransitionResquest) {
  return new Promise<SaveTransitionResquest>((resolve, reject) => {
    const { userId, currencyOrigin, amountOrigin, currencyDestiny } =
      transaction;
    if (!userId) reject("UserId must be provided");
    if (typeof userId !== "number") reject("UserId must be a number");
    if (!currencyOrigin || !currencyOrigin.length)
      reject("Currency Origin must be provided");
    if (typeof currencyOrigin !== "string")
      reject("Currency Origin must be a string");
    if (!amountOrigin || amountOrigin === 0)
      reject(
        "Amount Origin must be provided and value must be greater than zero"
      );
    if (typeof amountOrigin !== "number")
      reject("Amount Origin must be a number");
    if (!currencyDestiny || !currencyDestiny.length)
      reject("Currency Destination must be provided");
    if (typeof currencyDestiny !== "string")
      reject("Currency Destination must be a number");
    return resolve(transaction);
  });
}
export function converter(amountOrigin: number, rate: number) {
  return amountOrigin * rate;
}

const rateService = new RateService();

export class TransactionService {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    userId,
    currencyOrigin,
    amountOrigin,
    currencyDestiny,
  }: SaveTransitionResquest): Promise<SaveTransitionResquest> {
    const transaction = new Transaction({
      userId,
      currencyOrigin,
      amountOrigin,
      currencyDestiny,
    });
    return transaction;
  }

  async create(req: SaveTransitionResquest) {
    const newTransaction = await this.execute(req);
    const validTransaction = await validator(newTransaction);
    const updatedRate = await rateService.fetchRateApi(
      validTransaction.currencyOrigin,
      validTransaction.currencyDestiny
    );
    const rate = updatedRate.rates[validTransaction.currencyDestiny];
    const amountDestiny = converter(validTransaction.amountOrigin, rate);
    const savedTransaction = await this.transactionRepository
      .create(validTransaction, rate, amountDestiny)
      .catch((err) => logger.error(err));
    return savedTransaction;
  }

  async getTransactionsByUser(req: Request) {
    const { id } = req.params;
    const transactions = await this.transactionRepository.getById(parseInt(id));
    return transactions;
  }

  async getAllTransactions() {
    const transactions = await this.transactionRepository.getAll();
    return transactions;
  }
}
