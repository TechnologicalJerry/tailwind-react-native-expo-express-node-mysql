import { Request, Response } from 'express';
import userModel from '../models/userModel';

const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userModel.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getUser = async (req: Request, res: Response) => {
    try {
        const user = await userModel.getUserById(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

const createUser = async (req: Request, res: Response) => {
    try {
        const user = await userModel.createUser(req.body);
        res.status(201).json({ message: 'User created successfully', user });
    } catch (err: any) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

const loginUser = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { identifier, password } = req.body; // Identifier can be email or username

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Email or Username and password are required' });
        }

        const user = await userModel.loginUser(identifier, password);
        return res.status(200).json(user);
    } catch (err: any) {
        return res.status(err.status || 500).json({ message: err.message });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        await userModel.updateUser(req.params.id, req.body.name, req.body.email);
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        await userModel.deleteUser(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
};

export default { getUsers, getUser, createUser, loginUser, updateUser, deleteUser };