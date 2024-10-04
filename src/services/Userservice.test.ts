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

    it("Deve criar um usuário corretamente", async () => {
        const newUser = await UserService.createUser(emails[0], passwords[0]) as UserInstance

        expect(newUser).toBeInstanceOf(User)
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
        expect(arePwsEqual).toBe(true)
    })
    
    it("Não deve combinar com a senha no banco de dados", async () => {
        const user = await User.findByPk(2, { raw: false })
        expect(user).toBeInstanceOf(User)

        const userPw = user?.password
        expect(userPw).toBeDefined()

        const arePwsEqual = await UserService.matchPassword(passwords[2], userPw || "")
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

    it("Deve remover um usuário já criado", async () => {
        const wasUserDeleted = await UserService.deleteUser(emails[1])
        const searchDeletedUser = await User.findOne({ 
            where: { email: emails[1] } 
        })

        expect(wasUserDeleted).toBe(true)
        expect(searchDeletedUser).toBeNull()
    })

    it("Deve falhar em remover um usuário inexistente", async () => {
        const wasUserDeleted = await UserService.deleteUser("NAOEXISTO@email.com")
        const searchDeletedUser = await User.findOne({ 
            where: { email: emails[1] } 
        })

        expect(wasUserDeleted).toBe(false)
        expect(searchDeletedUser).toBeNull()
    })
})