/** FAZER OS SEGUINTES TESTES UNITÁRIOS:
 * 1) Criar um usuário corretamente.
 * 2) Não conseguir criar um usuário.
 * 3) Deve encontrar um usuário pelo email.
 * 4) Deve combinar com a senha no banco de dados.
 * 5) Não deve combinar com a senha no banco de dados.
 * 6) Deve retornar uma lista de usuários.
 */

import { User, UserInstance } from "../models/User";
import * as UserService from './Userservice'

describe('Testando User service', () => {

    let emails: string[] = ['teste@jest.com', 'apicom@jest.com']
    let passwords: string[] = ['123456', 'SouOSegundo', 's0v0t3rc31r0']

    beforeAll(async () => {
        await User.sync({ force: true })
        expect(2 + 2).toBe(4)
    })

    it.todo("Você passará!")
})