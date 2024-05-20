import { Router } from "express"
import { usuariosManager } from "../dao/UsuariosManager.js"
import { carritoManager } from "../dao/CarritoManager.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import { SECRET_KEY } from "../config.js"
import { auth } from "../middleware/auth.js"

export const router = Router()

router.post('/registro', async (req, res) => {
    try {
        const { usuario, contraseña } = req.body;
        if (!usuario || !contraseña) {
            throw new Error('Ingresa usuario y contraseña')
        }
            
        const carrito = await carritoManager.add()
        
        const hashedPassword = await bcrypt.hash(contraseña, 10)
        const nuevoUsuario = await usuariosManager.create({
            usuario,
            pw: hashedPassword,
            carrito: carrito.id
        })
        
        res.setHeader('Content-Type', 'application/json')
        return res.status(201).json({
            status: "success",
            payload: {
                nuevoUsuario
            }
        })
    } catch (err) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({
            status: 'error',
            error: err.message
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { usuario, contraseña } = req.body
        const user = await usuariosManager.getBy({usuario})

        if(!user) {
            throw new Error('Datos invalidos')
        }

        const match = await bcrypt.compare(contraseña, user.pw)


        if(!match) {
            throw new Error('Contraseña invalida')
        }

        const token = jwt.sign({id: user.id, username: user.usuario}, SECRET_KEY, {expiresIn: '1h'})
    
        res.setHeader('Content-Type', 'application/json')
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' })
        return res.status(200).json({
            status: "success",
            message: "Login exitoso"
        })
    } catch (err) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({
            status: 'error',
            error: err.message
        })
    }
})

router.post('/logout', auth, async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json')
        res.cookie('token', '', { httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(0) });
        return res.status(200).json({
            status: "success",
            message: "Logout exitoso"
        })
    } catch (err) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({
            status: 'error',
            error: err.message
        })
    }
})