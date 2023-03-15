import { Request, Response } from "express";
import { TransactionService } from "../services/TransactionService";

export class getAllTransactions {
  constructor(private transactionService: TransactionService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    this.transactionService
      .getAllTransactions()
      .then((value) => {
        return res.status(200).json(value);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
