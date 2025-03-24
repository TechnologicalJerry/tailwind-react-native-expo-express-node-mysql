import request from 'supertest';
import app from '../src/app';

describe('User API Endpoints', () => {
    it('should fetch all users', async () => {
        const res = await request(app).get('/users');
        expect(res.statusCode).toEqual(200);
    });

    it('should create a new user', async () => {
        const res = await request(app).post('/users').send({
            name: 'John Doe',
            email: 'johndoe@example.com',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id');
    });

    it('should fetch a single user', async () => {
        const res = await request(app).get('/users/1');
        expect(res.statusCode).toEqual(200);
    });

    it('should update a user', async () => {
        const res = await request(app).put('/users/1').send({
            name: 'Updated Name',
            email: 'updated@example.com',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('User updated successfully');
    });

    it('should delete a user', async () => {
        const res = await request(app).delete('/users/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('User deleted successfully');
    });
});
