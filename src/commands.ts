import { commandHelp } from "./command_help.js";
import { commandExit } from "./command_exit.js";
import type { CLICommand } from "./state.js";

export function getCommands(): Record<string, CLICommand> {
  return {
    help: {
      name: "help",
      description: "Prints help message",
      callback: commandHelp,
    },
    exit: {
      name: "exit",
      description: "Exits the application",
      callback: commandExit,
    },
  };
}
