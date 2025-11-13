import { State } from "./state";

function askQuestion(rl: any, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer: string) => {
      resolve(answer.trim());
    });
  });
}

export async function commandCreate(state: State, ...args: string[]) {
  console.log("Creating a new job application...\n");

  // Required fields
  const company = await askQuestion(state.readline, "Company name: ");
  if (!company) {
    console.log("Company name is required.");
    return;
  }

  const position = await askQuestion(state.readline, "Position title: ");
  if (!position) {
    console.log("Position title is required.");
    return;
  }

  // Optional fields
  const location = await askQuestion(state.readline, "Location (optional): ");
  const salaryRange = await askQuestion(
    state.readline,
    "Salary range (optional): ",
  );
  const jobDescription = await askQuestion(
    state.readline,
    "Job description (optional): ",
  );
  const applicationDate = await askQuestion(
    state.readline,
    "Application date (YYYY-MM-DD, optional): ",
  );

  // Validate application date format if provided
  if (applicationDate && !/^\d{4}-\d{2}-\d{2}$/.test(applicationDate)) {
    console.log("Invalid date format. Please use YYYY-MM-DD format.");
    return;
  }

  // Show summary and ask for confirmation
  console.log("\n--- Job Application Summary ---");
  console.log(`Company: ${company}`);
  console.log(`Position: ${position}`);
  if (location) console.log(`Location: ${location}`);
  if (salaryRange) console.log(`Salary Range: ${salaryRange}`);
  if (jobDescription) console.log(`Description: ${jobDescription}`);
  if (applicationDate) console.log(`Application Date: ${applicationDate}`);

  const confirm = await askQuestion(
    state.readline,
    "\nCreate this job application? (y/N): ",
  );
  if (confirm.toLowerCase() !== "y" && confirm.toLowerCase() !== "yes") {
    console.log("Job creation cancelled.");
    return;
  }

  try {
    // Insert the job into the database
    const insertStmt = state.db.prepare(`
      INSERT INTO jobs (company, position, location, salary_range, job_description, application_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = await insertStmt.run(
      company,
      position,
      location || null,
      salaryRange || null,
      jobDescription || null,
      applicationDate || null,
    );

    console.log(
      `\nJob application created successfully! (ID: ${result.lastInsertRowid})`,
    );

    // Create initial status update
    const statusStmt = state.db.prepare(`
      INSERT INTO job_status_updates (job_id, status, notes)
      VALUES (?, ?, ?)
    `);

    await statusStmt.run(
      result.lastInsertRowid,
      "Applied",
      "Initial application submitted",
    );

    console.log("Initial status set to 'Applied'.");
  } catch (error) {
    console.error("Error creating job application:", error);
  }
}
