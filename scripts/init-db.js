const fs = require("fs");
const path = require("path");

const dotenv = require("dotenv");
const sqlite3 = require("sqlite3").verbose();

dotenv.config();

const DATABASE_PATH = path.resolve(__dirname, "..", process.env.DATABASE_FILENAME || "default.db");

try {
  if (fs.existsSync(DATABASE_PATH)) {
    if (process.env.NODE_ENV === "test") {
      fs.unlinkSync(DATABASE_PATH)
    } else {
      return;
    } 
  }

  const seedDataDirectory = path.resolve(__dirname, "seed");

  const db = new sqlite3.Database(DATABASE_PATH);
  db.serialize(function() {
    const filenames = fs.readdirSync(seedDataDirectory);

    for (const filename of filenames) {
      if (path.extname(filename) !== ".sql") continue;

      const fileContents = fs.readFileSync(path.resolve(seedDataDirectory, filename)).toString();
      db.run(fileContents, (err) => {
        if (err) throw err;
      });
    };
  });
  db.close();
} catch (error) {
  console.error(`${path.basename(__filename)} failed: ${error.message}`);
}
