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

    //faz a sincronização entre a estrutura do model e o que está no banco de dados
    //se não existir, ele cria, se existir o "force", faz com que ele delete, e cria uma nova
    beforeAll(async () => {
        await User.sync({ force: true })
        expect(2 + 2).toBe(4)
    })

    it("Deve criar um usuário corretamente", async () => {
        const newUser = await UserService.createUser(emails[0], passwords[0]) as UserInstance

        expect(newUser).not.toBeInstanceOf(Error)
        expect(newUser).toHaveProperty('id')
        expect(newUser.email).toBe(emails[0])
        expect(newUser.password).not.toBe(passwords[0])
    })

    it("Não deve conseguir criar um usuário", async () => {
        const firstUser = await UserService.createUser(emails[1], passwords[1]) as UserInstance
        const secondUser = await UserService.createUser(emails[1], passwords[2]) as UserInstance

        expect(firstUser).toBeInstanceOf(User)
        expect(secondUser).toBeInstanceOf(Error)
        expect(secondUser).not.toBeInstanceOf(User)
    })

    it("Deve encontrar um usuário pelo email", async () => {
        const foundUser = await UserService.findByEmail(emails[0])
        
        expect(foundUser).not.toBeNull()
        expect(foundUser).toEqual({
            id: expect.any(Number),
            email: expect.any(String),
            password: expect.any(String)
        });
    })

    it("Deve combinar com a senha no banco de dados", async () => {
        const user = await User.findByPk(2, { raw: false })
        expect(user).toBeInstanceOf(User)

        const userPw = user?.password
        expect(userPw).toBeDefined()

        const arePwsEqual = await UserService.matchPassword(passwords[1], userPw || "")
        expect(arePwsEqual).toBeTruthy()
        expect(arePwsEqual).toBe(true)
    })

    
    it("Não deve combinar com a senha no banco de dados", async () => {
        const user = await User.findByPk(2, { raw: false })
        expect(user).toBeInstanceOf(User)

        const userPw = user?.password
        expect(userPw).toBeDefined()

        const arePwsEqual = await UserService.matchPassword(passwords[2], userPw || "")
        expect(arePwsEqual).toBeFalsy()
        expect(arePwsEqual).toBe(false)
    })

    it("Deve retornar uma lista de usuários", async () => {
        const userList = await UserService.all()

        expect(userList).toBeInstanceOf(Array)

        userList.forEach((user) => {
            expect(user).toEqual({
                id: expect.any(Number),
                email: expect.any(String),
                password: expect.any(String)
            })
        })
    })
})