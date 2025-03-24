import winston from 'winston';
import 'winston-daily-rotate-file';
import chalk from 'chalk';

// Log Format
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    const color = level === 'info' ? chalk.blue : level === 'warn' ? chalk.yellow : chalk.red;
    return `${chalk.gray(timestamp)} ${color(level.toUpperCase())}: ${message}`;
});

// Rotate file transport
const transport = new winston.transports.DailyRotateFile({
    filename: 'logs/server-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

// Logger Instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.colorize(),
                logFormat
            ),
        }),
        transport
    ],
});

export default logger;
