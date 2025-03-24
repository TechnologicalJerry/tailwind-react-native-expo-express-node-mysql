import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import { db } from './config/database';
import dotenv from 'dotenv';
import morgan from 'morgan';
import logger from './utils/logger';
import chalk from 'chalk';

dotenv.config();

const app = express();

// Morgan for request logging
app.use(morgan((tokens, req, res) => {
    return [
        chalk.green.bold(tokens.method(req, res)),
        chalk.cyan(tokens.url(req, res)),
        chalk.yellow(`${tokens.status(req, res)}`),
        chalk.magenta(`${tokens['response-time'](req, res)}ms`)
    ].join(' ');
}));

app.use(bodyParser.json());
app.use('/users', userRoutes);

// Test DB connection
db.getConnection((err, connection) => {
    if (err) {
        logger.error('❌ Database connection failed');
        throw err;
    }
    logger.info('✅ Connected to MySQL');
    connection.release();
});

export default app;
