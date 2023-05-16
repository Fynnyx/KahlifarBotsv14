
async function loadEvents(client) {
    const { loadFiles } = require('../helper/fileLoader');
    const { AsciiTable3 } = require('ascii-table3');
    const asciiTable = new AsciiTable3("Events");
    asciiTable.setHeading("Event", "Usage", "Load status");

    // Clear the events collection
    await client.events.clear();

    const files = await loadFiles('events');

    for (const file of files) {
        try {
            const event = require(file);

            const execute = (...args) => event.execute(...args, client);
            client.events.set(event.name, execute);

            if (event.rest) {
                if (event.once) {
                    client.rest.once(event.name, execute);
                } else {
                    client.rest.on(event.name, execute);
                }
            } else {
                if (event.once) {
                    client.once(event.name, execute);
                } else {
                    client.on(event.name, execute);
                }
            }
            asciiTable.addRow(event.name, event.usage, "✅");
        } catch (err) {
            client.logger.error(err);
            const path = file.split('/');
            const fileName = path[path.length - 1];
            asciiTable.addRow(fileName, "!! Error occured !!", `❌ -> ${err.message}`);
        }
    }
    const modLogChannel = await client.channels.fetch(client.config.channels.modConsole)
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
                modLogChannel.send(
                    { content: `${"```asciidoc\n" + asciiTableString + "\n```"}` }
                )
            }
            console.info(asciiTableString);
        }
        return;
    }
    if (process.env.ENVIRONMENT === "prd") {
        modLogChannel.send(
            { content: `${"```asciidoc\n" + asciiTable.toString() + "\n```"}` }
        )
    }
    console.info(asciiTable.toString());
}

module.exports = { loadEvents };