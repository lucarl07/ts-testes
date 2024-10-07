import request from 'supertest'
import app from '../app'
import { User } from '../models/User'

beforeAll(async () => {
    await User.sync({ force: true })
})

describe("Ao acessar POST /register", () => {    
    it.todo("Não deve registrar um usuário sem a senha.")
    it.todo("Não deve registrar um usuário sem o e-mail.")
    it.todo("Não deve registrar um usuário sem os dados.")
})

describe("Ao acessar POST /login", () => { // No momento, deve ser sempre executado após os testes de /POST register
    it.todo("Deve logar corretamente.")
})