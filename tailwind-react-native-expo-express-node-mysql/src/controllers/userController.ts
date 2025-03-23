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
        const user = await userModel.createUser(req.body.name, req.body.email);
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
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

export default { getUsers, getUser, createUser, updateUser, deleteUser };