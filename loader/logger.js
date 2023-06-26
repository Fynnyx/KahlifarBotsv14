const { format, createLogger, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;


const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
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
