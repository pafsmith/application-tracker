import { connect } from "@tursodatabase/database";
import { existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const dbPath = join(homedir(), "application-tracker.db");

const db = await connect(dbPath);

// Initialize database schema if tables don't exist
const tablesExist = await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('jobs', 'job_status_updates')");
const existingTables = await tablesExist.all();

if (existingTables.length < 2) {
  console.log("Creating database tables...");

  // Create jobs table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      location TEXT,
      salary_range TEXT,
      job_description TEXT,
      application_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create job_status_updates table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS job_status_updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company)`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_jobs_position ON jobs(position)`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_job_status_updates_job_id ON job_status_updates(job_id)`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_job_status_updates_status ON job_status_updates(status)`);
}

export { db };
