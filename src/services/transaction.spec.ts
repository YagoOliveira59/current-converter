import axios from "axios";
import { describe, expect, it, test } from "vitest";
import { Transaction } from "../entities/transactions";
import { TransactionService } from "./TransactionService";
import { TransactionRepository } from "../repository/TransactionRepository";
import { Rate, RateService } from "./RateService";

class RateResponse implements Rate {
  base: string;
  date: string;
  rates: { [propertyName: string]: number };
  success: boolean;
  timestamp: number;

  constructor(props: Rate) {
    this.base = props.base;
    this.date = props.date;
    this.rates = props.rates;
    this.success = props.success;
    this.timestamp = props.timestamp;
  }
}

test("create transaction", () => {
  const transaction = new Transaction({
    userId: 1,
    currencyOrigin: "USD",
    amountOrigin: 4,
    currencyDestiny: "BRL",
  });

  expect(transaction.userId).toBeTypeOf("number");
  expect(transaction.currencyOrigin).toEqual("USD");
  expect(transaction.userId).toBeGreaterThan(0);
  expect(transaction.currencyDestiny).toEqual("BRL");
});

describe("Create Transaction Service", () => {
  it("should be able to create an transaction", () => {
    const transactionRepository = new TransactionRepository();
    const saveTransaction = new TransactionService(transactionRepository);
    const transaction = new Transaction({
      userId: 3,
      currencyOrigin: "USD",
      amountOrigin: 4,
      currencyDestiny: "BRL",
    });
    expect(saveTransaction.execute(transaction)).resolves.toBeInstanceOf(
      Transaction
    );
  });
});

describe("API Exchange", () => {
  it("response of API Exchange should be equals than Rate Response Type", async () => {
    const rateService = new RateService();
    expect(rateService.fetchRateApi("USD", "BRL")).resolves.toBeInstanceOf(
      RateResponse
    );
  });
});

describe("GET /transactions", () => {
  it("return a list of transactions of userId 1", async () => {
    const instance = axios.create({ baseURL: "http://localhost:3333" });
    const response = await instance.get("/v1/transactions/1");
    expect(response.status).toBe(200);
    expect(response.data).toBeInstanceOf(Array);
    expect(response.data[0]).toHaveProperty("id", 1);
    expect(response.data[0]).toHaveProperty("amountOrigin", 1);
  });
});
