import { State } from "./state.js";
import { getAllJobsWithLatestStatus } from "./queries.js";

export async function commandList(state: State) {
  try {
    const jobs = await getAllJobsWithLatestStatus();

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

