import { Router } from "express"
import { usuariosManager } from "../dao/UsuariosManager.js"
import { carritoManager } from "../dao/CarritoManager.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import { SECRET_KEY } from "../config.js"
import { auth } from "../middleware/auth.js"
import passport from "passport"



export const router = Router()

router.get('/error', (req, res) => {
    res.setHeader('Content-Type','application/json');
    return res.status(500).json({
            status: 'error',
            message:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`
    })
})

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

router.get('/logout', auth, async (req, res) => {
    try {
        const clienturl = req.query.clienturl
        res.setHeader('Content-Type', 'application/json')
        res.cookie('authToken', '', { httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(0) });
        res.redirect(clienturl)
    } catch (err) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({
            status: 'error',
            error: err.message
        })
    }
})

router.get('/github', passport.authenticate('github'))

router.get('/callbackGithub', passport.authenticate('github', {failureRedirect: 'api/user/error', session: false}), async (req, res) => {
    try {
        const { id, usuario, carrito } = req.user
        const token = jwt.sign({id: id, username: usuario, carrito: carrito}, SECRET_KEY, {expiresIn: '7d'})
        
        res.cookie('authToken', token, { httpOnly: true, secure: true, sameSite: 'strict' })
        res.redirect('http://localhost:8080/')
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'error en inicio de sesion'
        })
    }
})

router.get('/google', async (req, res) => {
})
