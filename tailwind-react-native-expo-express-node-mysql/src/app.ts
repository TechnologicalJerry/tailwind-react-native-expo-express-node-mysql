import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import { db } from './config/database';

const app = express();

app.use(bodyParser.json());
app.use('/users', userRoutes);

// Test DB connection
db.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Connected to MySQL');
    connection.release();
});

export default app;