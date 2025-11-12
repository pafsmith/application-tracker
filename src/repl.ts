import { State } from "./state.js";

export function cleanInput(input: string): string[] {
  const cleanedInput = input
    .toLowerCase()
    .trim()
    .split(" ")
    .filter((word) => word.length > 0);
  return cleanedInput;
}

export async function startREPL(state: State) {
  state.readline.prompt();
  state.readline.on("line", async (input) => {
    const words = cleanInput(input);

    if (words.length === 0) {
      state.readline.prompt();
      return;
    }
    let args: string[] = [];
    const command = words[0];
    const commandObj = state.commands[command];
    if (words.length != 1) {
      args = words.slice(1);
    }
    if (commandObj === undefined) {
      console.log(
        `Unknown command: "${command}". Type "help" for a list of commmands`,
      );
      state.readline.prompt();
      return;
    }

    try {
      await commandObj.callback(state, ...args);
    } catch (err) {
      console.log((err as Error).message);
    }

    state.readline.prompt();
  });
}
