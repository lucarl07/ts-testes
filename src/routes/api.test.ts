import request from 'supertest'
import app from '../app'
import { User } from '../models/User'

beforeAll(async () => {
    await User.sync({ force: true })
})

describe("Ao acessar POST /register", () => {    
    
})

describe("Ao acessar POST /login", () => { // No momento, deve ser sempre executado após os testes de /POST register
    
})