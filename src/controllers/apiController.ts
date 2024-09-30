import { Request, Response } from 'express';
import * as UserService from '../services/Userservice'

export const ping = (req: Request, res: Response) => {
    res.json({ pong: true });
}

export const register = async (req: Request, res: Response) => {
    if (req.body.email && req.body.password) {
        let { email, password } = req.body;

        const newUser = await UserService.createUser(email, password)

        if (newUser instanceof Error) {
            res.status(409)
            return res.json({ error: newUser.message })
        } else {
            res.status(201)
            return res.json({ id: newUser.id })
        }
    }
    res.status(400).json({ error: 'E-mail e/ou senha não enviados.' });
}

export const login = async (req: Request, res: Response) => {
    if (req.body.email && req.body.password) {
        let email: string = req.body.email;
        let password: string = req.body.password;

        const user = await UserService.findByEmail(email)

        if (user && await UserService.matchPassword(password, user.password)) {
            res.status(201)
            return res.json({ status: true })
        } else {
            res.status(401)
            return res.json({ status: false })
        }
    }

    res.status(400).json({ error: 'E-mail e/ou senha não enviados.' });
}

export const list = async (req: Request, res: Response) => {
    try {
        let users = await UserService.all()
        let list: string[] = [];

        for (let i in users) {
            list.push(users[i].email);
        }

        return res.status(200).json({ list });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 
            error: 'Erro interno no servidor.'
        });
    }
}