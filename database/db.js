import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// caminho pro banco
const dbPath = path.join(__dirname, "steelfitness.sqlite");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS contatos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        telefone TEXT,
        grupo TEXT
        )
    `);

        db.run(`
    CREATE TABLE IF NOT EXISTS grupos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT UNIQUE
    )
    `);

});

export default db;
