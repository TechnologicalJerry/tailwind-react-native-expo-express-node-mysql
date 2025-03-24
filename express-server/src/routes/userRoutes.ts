import express from 'express';
import userController from '../controllers/userController';

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.post('/', userController.createUser);
router.post('/login', async (req, res, next) => {
    try {
        await userController.loginUser(req, res);
    } catch (err) {
        next(err); // Pass the error to Express error handler
    }
});
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;