module.exports = {
    name: 'error',
    usage: 'error',
    execute(client, error) {
        console.log(error);
        try {
            client.logger.error(error)
        } catch (error) {
            client.logger.error(error)
        }
    },
};