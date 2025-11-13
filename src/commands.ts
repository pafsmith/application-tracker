import { commandHelp } from "./command_help.js";
import { commandExit } from "./command_exit.js";
import { commandCreate } from "./command_create.js";
import { commandList } from "./command_list.js";
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
    create: {
      name: "create",
      description: "Creates a new job application",
      callback: commandCreate,
    },
    list: {
      name: "list",
      description: "Lists all job applications",
      callback: commandList,
    },
  };
}
