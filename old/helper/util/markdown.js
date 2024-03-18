function escapeFormatting(text) {
    const formattingCharacters = ['*', '_', '~', '`', '#', '-'];

    // Iterate through each formatting character
    formattingCharacters.forEach(char => {
        const regex = new RegExp(`\\${char}`, 'g');
        text = text.replace(regex, `\\${char}`);
    });

    return text;
}

module.exports = {
    escapeFormatting
}