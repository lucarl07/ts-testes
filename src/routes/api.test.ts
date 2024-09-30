import request from 'supertest'
import app from '../app'
import { User } from '../models/User'

describe('GET /ping', () => {
    it(`Deve responder "pong"`, async () => {
        const res = await request(app)
            .get("/ping")
            .expect(200)
            .expect("Content-Type", /json/)
        
        expect(res.body.pong).toBe(true)
    })
})