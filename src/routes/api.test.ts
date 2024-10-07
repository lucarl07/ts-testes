import request from 'supertest'
import app from '../app'
import { User } from '../models/User'

beforeAll(async () => {
    await User.sync({ force: true })
})

describe('GET /ping', () => {
    it(`Deve responder "pong"`, async () => {
        await request(app)
            .get("/ping")
            .expect(200)
            .expect("Content-Type", /json/)
            .then((res) => {
                expect(res.body.pong).toBe(true)
            })
    })
})

describe("POST /register", () => {    
    it(`Deve criar um usuário com êxito`, async () => {
        const email = "testando01@rotas.com"
        const password = "1q2w3e4r5t"
        const newUser = `email=${email}&password=${password}`;

        await request(app) 
            .post("/register")
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /json/)
            .expect((res) => {
                expect(res.body).toHaveProperty("id")
            })
    })

    it(`NÃO deve criar um usuário com e-mail já cadastrado`, async () => {
        const email = "testando01@rotas.com"
        const password = "souBemDiferente"
        const newUser = `email=${email}&password=${password}`;

        await request(app) 
            .post("/register")
            .send(newUser)
            .expect(409)
            .expect('Content-Type', /json/)
            .then((res) => {
                expect(res.body).toHaveProperty("error")
            })
    })

    it(`NÃO deve criar um usuário por ausência de dados`, async () => {
        const email = "testando02@rotas.com"
        const newUser = `email=${email}`;

        await request(app) 
            .post("/register")
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /json/)
            .then((res) => {
                expect(res.body).toHaveProperty("error")
            })
    })
})

describe("POST /login", () => { // No momento, deve ser sempre executado após os testes de /POST register
    it(`Deve acessar a conta com êxito`, async () => {
        const email = "testando01@rotas.com"
        const password = "1q2w3e4r5t"

        await request(app)
            .post("/login")
            .send(`email=${email}&password=${password}`)
            .expect(201)
            .expect('Content-Type', /json/)
            .then((res) => {
                expect(res.body.status).toBe(true)
            })
    })

    it(`NÃO deve acessar a conta por dados não cadastrados`, async () => {
        const email = "queroLogarHoje@email.com"
        const password = ".!9109128abc"

        await request(app)
            .post("/login")
            .send(`email=${email}&password=${password}`)
            .expect(401)
            .expect('Content-Type', /json/)
            .then((res) => {
                expect(res.body.status).toBe(false)
            })
    })

    it(`NÃO deve acessar a conta por ausência de dados`, async () => {
        const password = "SENHAMUITOSEGURA"

        await request(app)
            .post("/login")
            .send(`password=${password}`)
            .expect(400)
            .expect('Content-Type', /json/)
            .then((res) => {
                expect(res.body).toHaveProperty('error')
            })
    })
})

describe('GET /list', () => {
    it(`Deve retornar um objeto com propriedades "list" e "count"`, async () => {
        await request(app)
            .get("/list")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(({body}) => {
                expect(body).toBeInstanceOf(Object)
                expect(body).toHaveProperty("count")
                expect(body).toHaveProperty("list")
            })
    })

    it(`Deve retornar um número inteiro em "count"`, async () => {
        await request(app)
            .get("/list")
            .expect(200)
            .expect("Content-Type", /json/)
            .then((res) => {
                const count = res.body.count
                expect(count).toBe(Math.floor(count))
            })
    })

    it(`Deve retornar uma lista de e-mails válidos em "list"`, async () => {
        const emailRegExp = /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i
        
        await request(app)
            .get("/list")
            .expect(200)
            .expect("Content-Type", /json/)
            .then((res) => {
                const list = res.body.list;

                list.forEach((user: string) => {
                    expect(user).toMatch(emailRegExp)
                })
            })
    })
})

describe('DELETE /delete/:userEmail', () => {
    it('Deve remover um usuário já criado', async () => {
        const email = "testando01@rotas.com"

        await request(app)
            .delete(`/delete/${email}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                expect(res.body.message).toMatch(/sucesso/)
            })
    })

    it('Deve falhar em remover um usuário inexistente', async () => {
        const email = "testando02@rotas.com"

        await request(app)
            .delete(`/delete/${email}`)
            .expect(404)
            .expect('Content-Type', /json/)
            .then((res) => {
                expect(res.body.message).toMatch(/não foi encontrado/)
            })
    })
})