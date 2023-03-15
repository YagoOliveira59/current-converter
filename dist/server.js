"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_express3 = __toESM(require("express"));

// src/database/database.ts
var import_sqlite3 = require("sqlite3");
var import_pino = __toESM(require("pino"));

// src/config.ts
var dotenv = __toESM(require("dotenv"));
dotenv.config({ path: __dirname + "/.env" });
var config_default = {
  port: process.env.PORT || 3e3,
  env: process.env.NODE_ENV || "development",
  token: process.env.API_TOKEN || "",
  db: process.env.DB_NAME || ":memory:"
};

// src/database/database.ts
var logger = (0, import_pino.default)({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true
    }
  }
});
var db = new import_sqlite3.Database(config_default.db, (err) => {
  if (err) {
    logger.error(err.message);
    return;
  }
  logger.info(`Connected to the database ${config_default.db}`);
});
var database_default = db;

// src/server.ts
var import_pino3 = __toESM(require("pino"));
var import_fs = __toESM(require("fs"));

// src/routes/index.ts
var import_express = __toESM(require("express"));
var router = (0, import_express.default)();
router.get("/", function(req, res) {
  res.status(200).send({
    title: "API REST - Converter Currency",
    version: "1.0.0"
  });
});
var routes_default = router;

// src/routes/transactions.ts
var import_express2 = __toESM(require("express"));

// src/utils/logger.ts
var import_pino2 = __toESM(require("pino"));
var transport = import_pino2.default.transport({
  targets: [
    {
      target: "pino/file",
      options: {
        destination: `logs/server.log`
      },
      level: "error"
    },
    {
      target: "pino-pretty",
      options: {
        colorize: true
      },
      level: "info"
    }
  ]
});
var pinoConfig = (0, import_pino2.default)(
  {
    timestamp: import_pino2.default.stdTimeFunctions.isoTime
  },
  transport
);
var logger_default = pinoConfig;

// src/services/TransactionService.ts
var import_moment = __toESM(require("moment"));

// src/entities/transactions.ts
var Transaction = class {
  get userId() {
    return this.props.userId;
  }
  get currencyOrigin() {
    return this.props.currencyOrigin;
  }
  get amountOrigin() {
    return this.props.amountOrigin;
  }
  get currencyDestiny() {
    return this.props.currencyDestiny;
  }
  constructor(props) {
    this.props = props;
  }
};

// src/services/TransactionService.ts
var logger2 = logger_default;
function fecthRate(from, to) {
  return new Promise((resolve, reject) => {
    const requestHeader = new Headers();
    requestHeader.append("apikey", config_default.token);
    const requestOptions = {
      method: "GET",
      headers: requestHeader
    };
    fetch(
      `https://api.apilayer.com/exchangerates_data/latest?symbols=${to}&base=${from}`,
      requestOptions
    ).then((response) => response.json()).then((data) => {
      if (data.error) {
        reject(data.error);
        logger2.error(data.error);
      }
      resolve(data);
    }).catch((error) => {
      logger2.error(error);
      reject(error);
    });
  });
}
function saveToDatabase(transaction, rate, amountDestiny) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO transitions (userId, currencyOrigin, amountOrigin, currencyDestiny, rate, createdAt) VALUES (?, ?, ?, ?, ?, ?)";
    database_default.run(
      sql,
      [
        transaction.userId,
        transaction.currencyOrigin,
        transaction.amountOrigin.toFixed(2),
        transaction.currencyDestiny,
        rate,
        (0, import_moment.default)().utc(true).toISOString()
      ],
      function(err) {
        if (err) {
          logger2.error(err);
          reject();
        }
        resolve({
          id: this.lastID,
          userId: transaction.userId,
          currencyOrigin: transaction.currencyOrigin,
          amountOrigin: transaction.amountOrigin,
          currencyDestiny: transaction.currencyDestiny,
          amountDestiny,
          rate,
          createdAt: (0, import_moment.default)().utc(true).format()
        });
      }
    );
  });
}
function converter(amountOrigin, rate) {
  return amountOrigin * rate;
}
function validator(transaction) {
  return new Promise((resolve, reject) => {
    const { userId, currencyOrigin, amountOrigin, currencyDestiny } = transaction;
    if (!userId)
      reject("UserId must be provided");
    if (typeof userId !== "number")
      reject("UserId must be a number");
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
var TransactionService = class {
  async execute({
    userId,
    currencyOrigin,
    amountOrigin,
    currencyDestiny
  }) {
    const transaction = new Transaction({
      userId,
      currencyOrigin,
      amountOrigin,
      currencyDestiny
    });
    return transaction;
  }
  async create(req) {
    const newTransaction = await this.execute(req);
    const validTransaction = await validator(newTransaction);
    const updatedRate = await fecthRate(
      validTransaction.currencyOrigin,
      validTransaction.currencyDestiny
    );
    const rate = updatedRate.rates[validTransaction.currencyDestiny];
    const amountDestiny = converter(validTransaction.amountOrigin, rate);
    const savedTransaction = await saveToDatabase(
      validTransaction,
      rate,
      amountDestiny
    ).catch((err) => logger2.error(err));
    return savedTransaction;
  }
  async getTransactionsByUser(req) {
    return new Promise((resolve, reject) => {
      const { id } = req.params;
      const sql = "SELECT * FROM transitions WHERE userId = ?";
      database_default.all(sql, [parseInt(id)], (err, rows) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(rows);
        }
      });
    });
  }
  async getAllTransactions() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM transitions";
      database_default.all(sql, (err, rows) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(rows);
        }
      });
    });
  }
};

// src/controller/getAllTransactionController copy.ts
var allTransactions = async (req, res, next) => {
  try {
    const service = new TransactionService();
    service.getAllTransactions().then((value) => {
      return res.status(200).json(value);
    }).catch((error) => {
      console.log(error);
    });
  } catch (err) {
    return next(err);
  }
};

// src/controller/getTransactionByUserController.ts
var transactionsByUser = async (req, res, next) => {
  try {
    const service = new TransactionService();
    service.getTransactionsByUser(req).then((value) => {
      return res.status(200).json(value);
    }).catch((error) => {
      console.log(error);
    });
  } catch (err) {
    return next(err);
  }
};

// src/controller/saveTransactionController.ts
var saveTransactionToDatabase = async (req, res, next) => {
  try {
    const service = new TransactionService();
    service.create(req.body).then((response) => {
      return res.status(201).json(response);
    }).catch((error) => {
      return res.status(400).json(error);
    });
  } catch (err) {
    return next(err);
  }
};

// src/routes/transactions.ts
var router2 = (0, import_express2.default)();
router2.get("/:id", transactionsByUser);
router2.get("/", allTransactions);
router2.post("/", saveTransactionToDatabase);
var transactions_default = router2;

// src/server.ts
var app = (0, import_express3.default)();
var logger3 = (0, import_pino3.default)(
  {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true
      }
    }
  },
  import_pino3.default.destination(__dirname + "/pino-logger.log")
);
database_default.exec(import_fs.default.readFileSync(__dirname + "/sql/schema.sql").toString());
app.use(import_express3.default.json());
app.use("/v1/", routes_default);
app.use("/v1/transactions", transactions_default);
app.listen(config_default.port, () => {
  logger3.info(`listening port ${config_default.port}`);
});
