import { Router } from "express"
import { usuariosManager } from "../dao/UsuariosManager.js"
import { carritoManager } from "../dao/CarritoManager.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import passport from "passport"
import { SECRET_KEY } from "../config.js"
import { clientUrl } from "../middleware/clientUrl.js"



export const router = Router()

router.get('/error', (req, res) => {
    res.setHeader('Content-Type','application/json');
    return res.status(500).json({
            status: 'error',
            message:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`
    })
})

//login/registro rapido con passport
router.post('/access', passport.authenticate('local', { session: false}), async (req, res)=> {
    try {
        const token = req.user
        const clientUrl = req.query.clientUrl
        res.cookie('authToken', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        return res.redirect(clientUrl)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 
            status: 'error', 
            error: 'Error en inicio de sesión'
        })
    }
})


//se puede eliminar
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


// se puede eliminar
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

router.get('/logout',passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const clientUrl = req.query.clientUrl
        res.setHeader('Content-Type', 'application/json')
        res.cookie('authToken', '', { httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(0)})
        console.log('Logout con exito')
        res.redirect(clientUrl)
    } catch (err) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({
            status: 'error',
            error: err.message
        })
    }
})

router.get('/github', clientUrl, passport.authenticate('github'))

router.get('/github/callback', passport.authenticate('github', { session: false }), async (req, res) => {
    try {
        const token  = req.user
        const clientUrl = decodeURIComponent(req.cookies.clientUrl)
        
        res.cookie('authToken', token, { httpOnly: true, secure: true, sameSite: 'strict'})

        if(clientUrl) {
            return res.redirect(clientUrl)
        } else {
            return res.status(200).json({
                status: 'success',
                message: 'Usuario autenticado con github'
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'error en inicio de sesion'
        })
    }
})

router.get('/google', clientUrl, passport.authenticate('google'))

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res)=>{
    const token = req.user
    const clientUrl = decodeURIComponent(req.cookies.clientUrl)

    res.cookie('authToken', token, { httpOnly: true, secure: true, sameSite: 'strict' })

    if(clientUrl) {
        return res.redirect(clientUrl)
    } else {
        return res.status(200).json({
            status: 'success',
            message: 'Usuario autenticado con google'
        })
    }
})
