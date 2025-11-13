import { State } from "./state";

export async function commandList(state: State) {
  try {
    // Query all jobs with their latest status
    const jobsStmt = state.db.prepare(`
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

    const jobs = await jobsStmt.all();

    if (jobs.length === 0) {
      console.log(
        "No job applications found. Use 'create' to add your first job application.",
      );
      return;
    }

    console.log(`\nJob Applications (${jobs.length} total)\n`);

    jobs.forEach((job: any, index: number) => {
      console.log(`${index + 1}. ${job.company} - ${job.position}`);
      console.log(`   Status: ${job.status || "No status updates"}`);
      if (job.location) console.log(`   Location: ${job.location}`);
      if (job.salary_range) console.log(`   Salary: ${job.salary_range}`);
      if (job.application_date)
        console.log(`   Applied: ${job.application_date}`);
      if (job.status_updated_at) {
        console.log(`   Last Updated: ${job.status_updated_at}`);
      }
      console.log(`   Created: ${job.created_at}`);
      console.log("");
    });
  } catch (error) {
    console.error("Error retrieving jobs:", error);
  }
}

