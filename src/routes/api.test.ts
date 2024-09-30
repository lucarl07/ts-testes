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

describe('GET /list', () => {
    it(`Deve retornar um objeto com propriedades "list" e "count"`, async () => {
        const res = await request(app)
            .get("/list")
            .expect(200)
            .expect("Content-Type", /json/)

        expect(res.body).toBeInstanceOf(Object)
        expect(res.body).toHaveProperty("count")
        expect(res.body).toHaveProperty("list")
    })

    it(`Deve retornar um número inteiro em "count"`, async () => {
        const res = await request(app)
            .get("/list")
            .expect(200)
            .expect("Content-Type", /json/)

        const count = res.body.count

        expect(count).toBe(Math.floor(count))
    })

    it(`Deve retornar uma lista de e-mails válidos em "list"`, async () => {
        const res = await request(app)
            .get("/list")
            .expect(200)
            .expect("Content-Type", /json/)

        const list = res.body.list
        const emailRegExp = /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i

        list.forEach((user: string) => {
            expect(user).toMatch(emailRegExp)
        })
    })
})