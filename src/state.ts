import { createInterface, type Interface } from "readline";
import { getCommands } from "./commands.js";
import { Database } from "@tursodatabase/database";
import { db } from "./db.js";
export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State, ...args: string[]) => Promise<void>;
};

export type State = {
  readline: Interface;
  db: Database;
  commands: Record<string, CLICommand>;
};

export function initState(): State {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
  });
  return {
    readline: rl,
    db: db,
    commands: getCommands(),
  };
}
