const server = require('./server.js');
const request = require('supertest');
const db = require('../data/dbConfig.js')





beforeAll(async () => {
    return await db('users').truncate();
})

describe('server.js', () => {

    describe('POST /api/auth/register', () => {
        test('user sucessfully registers', async () => {
            const res = await request(server).post('/api/auth/register').send({ username: 'koyamot1', password: 'password' })
            expect(res.status).toBe(201);
        })
    })

    describe('POST /api/auth/register', () => {
        test('user sucessfully registers', async () => {
            const res = await request(server).post('/api/auth/register').send({ username: '', password: 'password' })
            expect(res.status).toBe(400);
        })
    })

    describe('POST /api/auth/login', () => {
        test('error for incorrect credentials', async () => {
            const result = await request(server).post('/api/auth/login').send({ username: "asdf1", password: "asdf2" });
            expect(result.status).toBe(400);
        });
        test('successfully logs in', async () => {
            const res = await request(server).post('/api/auth/login').send({ username: 'koyamot1', password: 'password' })
            expect(res.status).toBe(200);
        })
    })

    describe('GET /api/jokes', () => {
        test('no token = error', async () => {
            const result = await request(server).get('/api/jokes');
            expect(result.status).toBe(401);
        })
    })
    
})