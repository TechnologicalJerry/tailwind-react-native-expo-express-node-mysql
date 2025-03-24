import app from './app';
import dotenv from 'dotenv';
import logger from './utils/logger';
import chalk from 'chalk';

dotenv.config();

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
    logger.info(`🚀 Server running at ${chalk.green(`http://localhost:${PORT}`)}`);
});
