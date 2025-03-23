import { db } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const getAllUsers = (): Promise<RowDataPacket[]> => {
    return new Promise((resolve, reject) => {
        db.query<RowDataPacket[]>('SELECT * FROM users', (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

const getUserById = (id: string): Promise<RowDataPacket | null> => {
    return new Promise((resolve, reject) => {
        db.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
            if (err) reject(err);
            resolve(results.length > 0 ? results[0] : null);
        });
    });
};

const createUser = (name: string, email: string): Promise<{ id: number; name: string; email: string }> => {
    return new Promise((resolve, reject) => {
        db.query<ResultSetHeader>('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
            if (err) reject(err);
            resolve({ id: result.insertId, name, email });
        });
    });
};

const updateUser = (id: string, name: string, email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.query<ResultSetHeader>('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (err) => {
            if (err) reject(err);
            resolve();
        });
    });
};

const deleteUser = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id], (err) => {
            if (err) reject(err);
            resolve();
        });
    });
};

export default { getAllUsers, getUserById, createUser, updateUser, deleteUser };
