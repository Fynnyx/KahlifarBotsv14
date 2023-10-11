const { format, createLogger, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;


// const logFormat = printf(({ level, message, timestamp, err }) => {
//     console.log(err);
//     return `${timestamp} [${level}]: ${message}\n${err ? err.stack : ''}`;
// });

const logFormat = printf((info) => {
    let format = `${info.timestamp} [${info.level}]: ${info.message}`;
    if (['error'].includes(info.level)) {
        format += `\n${info.stack ? info.stack : ''}`;
    }
});

const logger = createLogger({
    level: 'info',
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new transports.File({
            filename: './logs/requests.log', level: 'http'
        }),
        new transports.File({
            filename: './logs/error.log', level: 'error'
        }),
        new transports.File({ filename: './logs/info.log' }),
    ]
});

const commandLogger = createLogger({
    level: 'info',
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new transports.File({
            filename: './logs/commands.log'
        })
    ]
});

module.exports = {
    logger,
    commandLogger
}
