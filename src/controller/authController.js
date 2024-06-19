import UsuariosService from "../services/UsuariosService.js"
import CarritoService from "../services/CarritoService.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import { SECRET_KEY } from "../config/config.js"
import { enviar_correo } from "../utils/mail.js"
import crypto from 'crypto'


export async function error(req, res){
    res.setHeader('Content-Type','application/json');
    return res.status(500).json({
            status: 'error',
            message:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`
    })
}

export async function login(req, res){
    try {
        const { user } = req
        delete user.pw
        delete user.email
        const token = jwt.sign(user, SECRET_KEY, {expiresIn: '7d'})
        res.cookie('authToken', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        res.setHeader('Content-Type', 'application/json')
        return res.status(201).json({
            status: "success",
            message: "Se ha iniciado sesion"
        })
    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ 
            status: 'error', 
            error: 'Error en inicio de sesión'
        })
    }
}
export async function logout(req, res){
    try {
        res.setHeader('Content-Type', 'application/json')
        res.cookie('authToken', '', { httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(0)})
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({
            status: 'success',
            message: 'Sesion cerrada'
        })
    } catch (err) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({
            status: 'error',
            error: err.message
        })
    }
}
export async function register(req, res){
    try {
        const { username, password, code } = req.body
        const { email: is_email, code: is_code} = req.user
        const compare = await bcrypt.compare(code, is_code)
        if (
            username === is_email &&
            compare
        ) {
            const carrito = await CarritoService.create()
            const hashedPassword = await bcrypt.hash(password, 10)
            const nuevoUsuario = await UsuariosService.create({
                email: username,
                pw: hashedPassword,
                carrito: carrito._id
            })
            delete nuevoUsuario.pw
            delete nuevoUsuario.email
            const authToken = jwt.sign(nuevoUsuario, SECRET_KEY, {expiresIn: '7d'})
            res.cookie('authToken', authToken, { httpOnly: true, secure: true, sameSite: 'strict' })
            res.setHeader('Content-Type', 'application/json')
            return res.status(201).json({
                status: "success",
                payload: nuevoUsuario
            })
        } else {
            throw new Error('Codigo invalido')
        }

        } catch (err) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({
                status: 'error',
                error: err.message
        })
    }
}
export async function send_verification(req, res){
    try{
        const { email } = req.body
        if (!email) {
            throw new Error('Falta email')
            }
        const exist = await UsuariosService.getBy({email: email})
        if (exist){
            throw new Error('El correo ya es utilizado por otro usuario')
        }
        const verification_code = crypto.randomBytes(3).toString('hex')
        const hash_code = await bcrypt.hash(verification_code, 10)
        const token = jwt.sign({ email, code: hash_code }, SECRET_KEY, { expiresIn: '2min' })
        const TWO_MIN = Date.now() + 2 * 60 * 1000
        res.cookie('code', token, {
            httpOnly: true, 
            secure: true, 
            sameSite: 'strict', 
            expires: new Date(TWO_MIN) 
        })
        const content = {
            subject: '[App Prueba] Confirm Email',
            text:`Tu codigo de verificacion es: ${verification_code}` ,
            html: `
            <h3>Tu codigo de verificacion es: </h3>
            <div>
                <p style=padding:10px; border-radius:2px >${verification_code}</p>
            </div>
            `
        }
        const response = await enviar_correo(email, content)
        if(!response.messageId) throw new Error('Error al enviar correo, intentalo de nuevo')
        res.setHeader('Content-Type', 'application/json')
        return res.status(201).json({
            status: "success",
            message: "Se envio el codigo al correo electronico" 
            })
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            status: 'error', 
            error: err.message
        })
    }
}
export async function google_cb(req, res){
    const token = req.user

    res.cookie('authToken', token, { httpOnly: true, secure: true, sameSite: 'strict' })
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json({
        status: 'success',
        message: 'Usuario autenticado con google'
    })
}

