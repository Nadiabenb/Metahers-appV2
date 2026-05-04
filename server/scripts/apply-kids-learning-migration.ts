import fs from "node:fs";
import path from "node:path";
import { pool } from "../db";

async function main() {
  const migrationFiles = [
    "migrations/0003_add_kids_learning_progress.sql",
    "migrations/0004_add_child_age.sql",
  ];

  for (const file of migrationFiles) {
    const migrationPath = path.resolve(process.cwd(), file);
    const migrationSql = fs.readFileSync(migrationPath, "utf8");
    await pool.query(migrationSql);
  }

  const result = await pool.query(
    "select to_regclass('public.kids_learning_progress') as table_name"
  );

  if (result.rows[0]?.table_name !== "kids_learning_progress") {
    throw new Error("kids_learning_progress table was not created");
  }

  const ageColumn = await pool.query(
    "select column_name from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'child_age'"
  );

  if (ageColumn.rowCount === 0) {
    throw new Error("users.child_age column was not created");
  }

  console.log("Kids Learning migrations applied: progress table and child age column exist");
}

main()
  .catch((error) => {
    console.error("Kids Learning migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
