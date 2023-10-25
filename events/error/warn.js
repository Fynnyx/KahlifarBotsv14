module.exports = {
    name: 'warn',
    usage: 'warn',
    execute(client, warn) {
        console.log(error);
        try {
            client.logger.console.warn(error)
        } catch (error) {
            client.logger.error(error)
        }
    },
};