
module.exports = {
    name: 'messageCreate',
    usage: 'messageCreate',
    async execute(message, client) {
        try {
            // Counting system
            if (message.channel.id === client.config.channels.counting) {
                if (message.author.bot) return;
                // Check if the message is a number
                if (isNaN(message.content)) return message.delete();
                // Check if the message is the next number
                const lastMessage = await message.channel.messages.fetch({ limit: 2 });
                // If there is no message the number needs to be one
                if (lastMessage.size === 1) {
                    if (message.content !== "1") return message.delete();
                    return;
                }
                if (lastMessage.last().author.id === message.author.id) return message.delete();
                const lastNumber = parseInt(lastMessage.last().content);
                const currentNumber = parseInt(message.content);
                // Check if the message is the next number
                if (currentNumber !== lastNumber + 1) return message.delete();
            }
        } catch (error) {
            client.logger.error(error)
        }
    },
};