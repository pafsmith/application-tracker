import type { State } from "./state.js";

export async function commandExit(state: State) {
  console.log("Closing the tracker... Goodbye!");
  state.readline.close();
  process.exit(0);
}
