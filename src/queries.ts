import { db } from "./db.js";

export interface JobData {
  company: string;
  position: string;
  location?: string;
  salaryRange?: string;
  jobDescription?: string;
  applicationDate?: string;
}

export interface JobStatusUpdate {
  jobId: number;
  status: string;
  notes?: string;
}

export interface JobWithStatus {
  id: number;
  company: string;
  position: string;
  location?: string;
  salary_range?: string;
  job_description?: string;
  application_date?: string;
  created_at: string;
  updated_at: string;
  status?: string;
  status_updated_at?: string;
}

export async function insertJob(jobData: JobData): Promise<number> {
  const insertStmt = db.prepare(`
    INSERT INTO jobs (company, position, location, salary_range, job_description, application_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = await insertStmt.run(
    jobData.company,
    jobData.position,
    jobData.location || null,
    jobData.salaryRange || null,
    jobData.jobDescription || null,
    jobData.applicationDate || null,
  );

  return result.lastInsertRowid as number;
}

export async function insertJobStatusUpdate(statusUpdate: JobStatusUpdate): Promise<void> {
  const statusStmt = db.prepare(`
    INSERT INTO job_status_updates (job_id, status, notes)
    VALUES (?, ?, ?)
  `);

  await statusStmt.run(
    statusUpdate.jobId,
    statusUpdate.status,
    statusUpdate.notes || null,
  );
}

export async function getAllJobsWithLatestStatus(): Promise<JobWithStatus[]> {
  const jobsStmt = db.prepare(`
    SELECT
      j.*,
      s.status,
      s.updated_at as status_updated_at
    FROM jobs j
    LEFT JOIN (
      SELECT job_id, status, updated_at
      FROM job_status_updates
      WHERE (job_id, updated_at) IN (
        SELECT job_id, MAX(updated_at)
        FROM job_status_updates
        GROUP BY job_id
      )
    ) s ON j.id = s.job_id
    ORDER BY j.created_at DESC
  `);

  return await jobsStmt.all() as JobWithStatus[];
}