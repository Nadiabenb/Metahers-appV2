import fs from "node:fs";
import path from "node:path";
import { pool } from "../db";

async function main() {
  const migrationPath = path.resolve(process.cwd(), "migrations/0003_add_kids_learning_progress.sql");
  const migrationSql = fs.readFileSync(migrationPath, "utf8");

  await pool.query(migrationSql);

  const result = await pool.query(
    "select to_regclass('public.kids_learning_progress') as table_name"
  );

  if (result.rows[0]?.table_name !== "kids_learning_progress") {
    throw new Error("kids_learning_progress table was not created");
  }

  console.log("Kids Learning migration applied: kids_learning_progress exists");
}

main()
  .catch((error) => {
    console.error("Kids Learning migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
