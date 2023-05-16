async function loadCommands(client) {
    const { loadFiles } = require('../helper/fileLoader');
    const {AsciiTable3} = require('ascii-table3');
    const asciiTable = new AsciiTable3(`Commands ${client.commands.size}`);
    asciiTable.setHeading("Command", "Description", "Load status")

    // Clear the commands collection
    await client.commands.clear();

    let commandsArray = [];

    const files = await loadFiles('commands');

    for (const file of files) {
        try {
            const command = require(file);
            if (!command.data) continue;
            client.commands.set(command.data.name, command);
            commandsArray.push(command.data.toJSON());
            asciiTable.addRow(command.data.name, command.data.description, "✅");
        } catch (err) {
            client.logger.error(err);
            const filePathArray = file.split("/")
            const fileName = filePathArray[filePathArray.length - 1];
            asciiTable.addRow(fileName, "!! Error occured !!", `❌ -> ${err.message}`);
        }
    }
    client.application.commands.set(commandsArray);
    asciiTable.setTitle(`Commands ${client.commands.size}`);

    // Split string into multiple messages if it is too long
    if (asciiTable.toString().length > 2000) {
        const asciiTableArray = asciiTable.toString().split("\n");
        let asciiTableString = "";
        let asciiTableStringArray = [];
        for (const asciiTableLine of asciiTableArray) {
            if (asciiTableString.length + asciiTableLine.length > 2000) {
                asciiTableStringArray.push(asciiTableString);
                asciiTableString = "";
            }
            asciiTableString += asciiTableLine + "\n";
        }
        asciiTableStringArray.push(asciiTableString);
        for (const asciiTableString of asciiTableStringArray) {
            if (process.env.ENVIRONMENT === "prd") {
                const modLogChannel = await client.channels.fetch(client.config.channels.modConsole)
                modLogChannel.send(
                    { content: `${"```asciidoc\n" + asciiTableString + "\n```"}` }
                )

            }
            console.info(asciiTableString);
        }
        return;
    }
}

module.exports = { loadCommands };