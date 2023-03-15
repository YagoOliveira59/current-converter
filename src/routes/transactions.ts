import Router from "express";
import { TransactionService } from "../services/TransactionService";
import { TransactionRepository } from "../repository/TransactionRepository";
import { getAllTransactions } from "../controller/getAllTransactionController copy";
import { getAllTransactionsByUser } from "../controller/getTransactionByUserController";
import { saveTransactionController } from "../controller/saveTransactionController";

const router = Router();

const transactionRepository = new TransactionRepository();
const transactionService = new TransactionService(transactionRepository);
const getAllByUserController = new getAllTransactionsByUser(transactionService);
const getAllTransactionsController = new getAllTransactions(transactionService);
const saveController = new saveTransactionController(transactionService);

router.get(
  "/",
  getAllTransactionsController.getAll.bind(getAllTransactionsController)
);
router.post("/", saveController.saveTransaction.bind(saveController));
router.get("/:id", getAllByUserController.getAll.bind(getAllByUserController));

export default router;
