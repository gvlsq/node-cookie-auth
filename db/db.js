const path = require("path");

const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();
const SQLiteStore = require("connect-sqlite3")(session);

const DATABASE_PATH = path.resolve(__dirname, "..", process.env.DATABASE_FILENAME || "default.db");

let db;

exports.initDatabase = function(callback) {
  if (db) throw new Error("Database is already initialized");

  db = new sqlite3.Database(DATABASE_PATH, function(err) {
    callback(err);
  });
}

exports.createSessionStore = function() {
  return new SQLiteStore({
    db: path.relative("./", DATABASE_PATH), // connect-sqlite3 has quirks related to how it handles paths
    table: "SESSION",
  });  
}

exports.execute = function(query, params, callback) {
  if (!db) throw new Error("Database has not been initialized");

  db.run(query, params, function(err) {
    callback(err, this.lastID);
  });
}

exports.query = function(query, params, callback) {
  if (!db) throw new Error("Database has not been initialized");

  db.all(query, params, function(err, rows) {
    callback(err, rows);
  });
}

exports.querySingle = function(query, params, callback) {
  if (!db) throw new Error("Database has not been initialized");

  db.get(query, params, function(err, row) {
    callback(err, row);
  });
}

exports.closeDatabase = function() {
  if (!db) throw new Error("Attempted to close a database connection that was never opened");

  db.close(function(err) {
    if (err) throw err;

    console.log(`Closed the SQLite database connection with ${DATABASE_FILENAME}`);
  }); 
}
