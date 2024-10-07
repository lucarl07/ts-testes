import request from 'supertest'
import app from '../app'
import { User } from '../models/User'

beforeAll(async () => {
  await User.sync({ force: true })
})

describe("Ao acessar POST /register", () => {
  it("Não deve registrar um usuário sem a senha", async () => {
    const password = '320jrf490j4'

    await request(app)
      .post('/register')
      .send(`password=${password}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('error')
      })
  })

  it("Não deve registrar um usuário sem o e-mail", async () => {
    const email = 'umBomEmail@email.com'
    
    await request(app)
      .post('/register')
      .send(`email=${email}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('error')
      })
  })
  
  it("Não deve registrar um usuário sem os dados", async () => {
    await request(app)
      .post('/register')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('error')
      })
  })

  it("Deve criar uma conta corretamente", async () => {
    const email = 'umBomEmail@email.com'
    const password = '320jrf490j4'
    
    await request(app)
      .post('/register')
      .send(`email=${email}&password=${password}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('id')
        expect(res.body.id).toBeTruthy()
      })
  })
})

describe("Ao acessar POST /login", () => { // No momento, deve ser sempre executado após os testes de /POST register
  it("Deve logar corretamente", async () => {
    const email = 'umBomEmail@email.com'
    const password = '320jrf490j4'

    await request(app)
      .post('/login')
      .send(`email=${email}&password=${password}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('status')
        expect(res.body.status).toBe(true)
      })
  })
})