CREATE TABLE IF NOT EXISTS transitions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    currencyOrigin TEXT NOT NULL,
    amountOrigin REAL NOT NULL,
    currencyDestiny TEXT NOT NULL,
    rate REAL NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);