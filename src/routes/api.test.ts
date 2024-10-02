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

describe("POST /register", () => {
    it.todo(`Deve criar um usuário com êxito`)

    it.todo(`NÃO deve criar um usuário com e-mail já cadastrado`)

    it.todo(`NÃO deve criar um usuário por ausência de dados`)
})

describe("POST /login", () => {
    it.todo(`Deve logar no site com êxito`)

    it.todo(`NÃO deve logar no site por dados não cadastrados`)

    it.todo(`NÃO deve logar no site por ausência de dados`)
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