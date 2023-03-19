async function loadCommands(client) {
    const { loadFiles } = require('../helper/fileLoader');
    const ascii = require('ascii-table');
    const asciiTable = new ascii("Commands");
    asciiTable.setHeading("Command", "Load status");

    // Clear the commands collection
    await client.commands.clear();

    let commandsArray = [];

    const files = await loadFiles('commands');

    for (const file of files) {
        const command = require(file);
        try {
            client.commands.set(command.data.name, command);
            commandsArray.push(command.data.toJSON());
            asciiTable.addRow(command.data.name, "✅");
        } catch (err) {
            console.error(err);
            asciiTable.addRow(command.data.name, `❌ -> ${err.message}`);
        }
    }
    client.application.commands.set(commandsArray);

    return console.info(asciiTable.toString());
}

module.exports = { loadCommands };