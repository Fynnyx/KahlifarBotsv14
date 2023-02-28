const asciiTable = require('ascii-table');

async function loadEvents(client) {
    const { loadFiles } = require('../helper/fileLoader');
    const ascii = require('ascii-table');
    const asciiTable = new ascii("Events");
    asciiTable.setHeading("Event", "Load status");

    // Clear the events collection
    await client.events.clear();

    const files = await loadFiles('events');

    for (const file of files) {
        const event = require(file);
        try {


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
            asciiTable.addRow(event.name, "✅");
        } catch (err) {
            console.error(err);
            asciiTable.addRow(event.name, `❌ -> ${err.message}`);
        }
    }
    return console.info(asciiTable.toString());
}

module.exports = { loadEvents };