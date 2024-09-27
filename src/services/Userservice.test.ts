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

    let email = 'teste@jest.com'
    let password = '1234'

    //faz a sincronização entre a estrutura do model e o que está no banco de dados
    //se não existir, ele cria, se existir o "force", faz com que ele delete, e cria uma nova
    beforeAll(async () => {
        await User.sync({ force: true })
        expect(2 + 2).toBe(4)
    })

    it("Deve criar um usuário corretamente", async () => {
        const newUser = await UserService.createUser(email, password) as UserInstance
        expect(newUser).not.toBeInstanceOf(Error)
        expect(newUser).toHaveProperty('id')
        expect(newUser.email).toBe(email)
        expect(newUser.password).not.toBe(password)
    })

    it("Não deve conseguir criar um usuário", async () => {
        // Primeiro usuário:
        await UserService.createUser(email, 'SouOPrimeiro')

        // Segundo usuário, com o mesmo e-mail do primeiro:
        const secondUser = await UserService.createUser(email, 's0v0s3gvnd0')

        expect(secondUser).toBeInstanceOf(Error)
    })
})