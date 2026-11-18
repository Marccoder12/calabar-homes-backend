import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Database location
const dbPath = path.resolve(__dirname, "../../data/calabarhomes.db");

// Ensure the data directory exists
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

console.log("Initializing database...");
console.log("Database path:", dbPath);


// Create database connection
const db = new Database(dbPath);
// Database configuration
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");


console.log("Database connection opened.");


try{

    // Optional performance settings
    // db.pragma("synchronous = NORMAL");
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        token TEXT NOT NULL UNIQUE,
        user_id TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        expires_at TEXT NOT NULL,

        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
    );
    `);
        console.log("Tables created successfully.");
 const tables = db.prepare(`
        SELECT name FROM sqlite_master
        WHERE type = 'table'
    `).all();

    console.log("Existing tables:", tables);
}catch (error) {
    console.error("Error initializing database schema:", error);
    process.exit(1);
}
export default db;