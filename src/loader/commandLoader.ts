import CustomClient from "@/types/CustomClient";
import { AsciiTable3 } from "ascii-table3";
import { loadFiles } from "./fileLoader";
import { CustomCommand } from "@/types/CustomCommand";

export async function loadCommands(client: CustomClient<true>): Promise<void> {
    // Setup the ascii table
    const asciiTable = new AsciiTable3();
    asciiTable.setHeading("Command", "Description", "Loaded");

    // Load the files
    const files = await loadFiles("commands");

    const commandsArray = []
    // Cycle through the files and load the commands
    for (const file of files) {
        try {
            const command = (await import(file)).default as CustomCommand;
            client.commands.set(command.data.name, command);
            commandsArray.push(command.data.toJSON());
            asciiTable.addRow(command.data.name, command.data.description, "✔");
        } catch (error: any) {
            const path = file.split('/');
            const fileName = path[path.length - 1];
            asciiTable.addRow(fileName, "Error occured", `✖ -> ${error.message}`);
        }
    }
    client.application.commands.set(commandsArray);
    asciiTable.setTitle(`Commands (${client.commands.size})`)
    console.info(asciiTable.toString());
    
    // ToDo: Send the table to the log channel

}