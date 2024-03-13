import CustomClient from "@/types/CustomClient";
import { loadFiles } from "./fileLoader";
import { CustomEvent } from "@/types/CustomEvent";
import { AsciiTable3 } from "ascii-table3";

export async function loadEvents(client: CustomClient) {
    // Setup the ascii table
    const asciiTable = new AsciiTable3();
    asciiTable.setHeading("Event", "Usage", "Loaded");

    // Load the files
    const files = await loadFiles("events");
    // Cycle through the files and load the events
    for (const file of files) {
        try {
            const event = (await import(file)).default as CustomEvent;
            client.events.set(event.name, event);

            if (event.once) {
                client.once(event.name.toString(), (...args) => event.execute(client, ...args));
            } else {
                client.on(event.name.toString(), (...args) => event.execute(client, ...args));
            }
            asciiTable.addRow(event.name, event.usage, "✔");
        } catch (error: any) {
            const path = file.split('/');
            const fileName = path[path.length - 1];
            asciiTable.addRow(fileName, "Error occured", `✖ -> ${error.message}`);
        }
    }
    asciiTable.setTitle(`Events (${client.events.size})`)
    console.info(asciiTable.toString());
}