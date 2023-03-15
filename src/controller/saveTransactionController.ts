import { Request, Response } from "express";
import { TransactionService } from "../services/TransactionService";

export class saveTransactionController {
  constructor(private transactionService: TransactionService) {}

  async saveTransaction(req: Request, res: Response): Promise<void> {
    this.transactionService
      .create(req.body)
      .then((response) => {
        return res.status(201).json(response);
      })
      .catch((error) => {
        return res.status(400).json(error);
      });
  }
}
