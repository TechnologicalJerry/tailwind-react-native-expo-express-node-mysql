import { db } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import bcrypt from 'bcryptjs';
import chalk from 'chalk';

// ✅ Define User Interface
interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
}

// ✅ Fetch All Users
const getAllUsers = (): Promise<User[]> => {
    return new Promise((resolve, reject) => {
        db.execute<RowDataPacket[]>('SELECT * FROM users', (err, results) => {
            if (err) {
                console.error(chalk.red(`❌ Error fetching users: ${err.message}`));
                return reject({ status: 500, message: 'Database error' });
            }
            resolve(results as User[]);
        });
    });
};

// ✅ Fetch User by ID
const getUserById = (id: string): Promise<User | null> => {
    return new Promise((resolve, reject) => {
        db.execute<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error(chalk.red(`❌ Error fetching user: ${err.message}`));
                return reject({ status: 500, message: 'Database error' });
            }
            resolve(results.length > 0 ? (results[0] as User) : null);
        });
    });
};

// ✅ Hash Password Function
const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// ✅ Create User
const createUser = async (userData: any): Promise<{ id: number; username: string; email: string }> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { username, email, password, confirm_password, first_name, last_name, date_of_birth, gender, phone_number, address, profile_picture_url, roles, preferences } = userData;

            // 🔴 Validate that password and confirm_password match
            if (password !== confirm_password) {
                console.log(chalk.yellow(`⚠️ Passwords do not match for user: ${email}`));
                return reject({ status: 400, message: 'Passwords do not match' });
            }

            // ✅ Hash password
            const hashedPassword = await hashPassword(password);

            db.execute<ResultSetHeader>(
                `INSERT INTO users (username, email, password, first_name, last_name, date_of_birth, gender, phone_number, street, city, state, postal_code, country, profile_picture_url, roles, preferences) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

                [username, email, hashedPassword, first_name, last_name, date_of_birth, gender, phone_number, address.street, address.city, address.state, address.postal_code, address.country, profile_picture_url, JSON.stringify(roles), JSON.stringify(preferences)],

                (err, result) => {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            console.log(chalk.yellow(`⚠️ User with email ${email} already exists.`));
                            return reject({ status: 400, message: 'User already exists' });
                        }
                        console.error(chalk.red(`❌ MySQL Error: ${err.message}`));
                        return reject({ status: 500, message: 'Database error' });
                    }
                    console.log(chalk.green(`✅ User created successfully: ${username} (ID: ${result.insertId})`));
                    resolve({ id: result.insertId, username, email });
                }
            );
        } catch (error: any) {
            console.error(chalk.red(`❌ Error hashing password: ${error.message}`));
            reject({ status: 500, message: 'Internal server error' });
        }
    });
};

// ✅ Login User
const loginUser = (identifier: string, password: string): Promise<{ message: string; user: Partial<User> }> => {
    return new Promise((resolve, reject) => {
        db.execute<RowDataPacket[]>(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [identifier, identifier],
            async (err, results) => {
                if (err) {
                    console.error(chalk.red(`❌ MySQL Error: ${err.message}`));
                    return reject({ status: 500, message: 'Database error' });
                }

                if (!results || results.length === 0) {
                    console.log(chalk.yellow(`⚠️ No user found with email/username: ${identifier}`));
                    return reject({ status: 404, message: 'Invalid email/username or password' });
                }

                const user: User = {
                    id: results[0].id,
                    username: results[0].username,
                    email: results[0].email,
                    password: results[0].password,
                    first_name: results[0].first_name,
                    last_name: results[0].last_name,
                };

                try {
                    const isMatch = await bcrypt.compare(password, user.password);

                    if (!isMatch) {
                        console.log(chalk.yellow(`⚠️ Invalid password attempt for user: ${identifier}`));
                        return reject({ status: 401, message: 'Invalid email/username or password' });
                    }

                    console.log(chalk.green(`✅ User logged in successfully: ${identifier}`));

                    // Remove sensitive info before sending response
                    const safeUser: Partial<User> = {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        first_name: user.first_name,
                        last_name: user.last_name,
                    };

                    resolve({ message: 'Login successful', user: safeUser });
                } catch (error: any) {
                    console.error(chalk.red(`❌ Error comparing passwords: ${error.message}`));
                    return reject({ status: 500, message: 'Internal server error' });
                }
            }
        );
    });
};

// ✅ Update User
const updateUser = (id: string, username: string, email: string): Promise<{ message: string }> => {
    return new Promise((resolve, reject) => {
        db.execute<ResultSetHeader>(
            'UPDATE users SET username = ?, email = ? WHERE id = ?',
            [username, email, id],
            (err, result) => {
                if (err) {
                    console.error(chalk.red(`❌ Error updating user: ${err.message}`));
                    return reject({ status: 500, message: 'Database error' });
                }
                if (result.affectedRows === 0) {
                    return reject({ status: 404, message: 'User not found' });
                }
                console.log(chalk.green(`✅ User updated successfully: ID ${id}`));
                resolve({ message: 'User updated successfully' });
            }
        );
    });
};

// ✅ Delete User
const deleteUser = (id: string): Promise<{ message: string }> => {
    return new Promise((resolve, reject) => {
        db.execute<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.error(chalk.red(`❌ Error deleting user: ${err.message}`));
                return reject({ status: 500, message: 'Database error' });
            }
            if (result.affectedRows === 0) {
                return reject({ status: 404, message: 'User not found' });
            }
            console.log(chalk.green(`✅ User deleted successfully: ID ${id}`));
            resolve({ message: 'User deleted successfully' });
        });
    });
};

// ✅ Export Functions
export default { getAllUsers, getUserById, createUser, loginUser, updateUser, deleteUser };
