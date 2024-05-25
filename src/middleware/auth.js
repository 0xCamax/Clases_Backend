import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config.js';


//para api
export const auth = (req, res, next) => {
    const token = req.cookies.authToken
    if (!token){
        return res.status(403).json({
            status: 'error',
            message: 'Usuario no autenticado'
        })
    }
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: 'error',
                message: 'Token inválido o expirado'
            });
        }

        req.user = user
        next()
    })
}


//para el router views

export const checkAuth = (req, res, next) => {
    const token = req.cookies.authToken

    if(token) {
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                console.log('Token inválido o expirado')
                return res.redirect('/login')
            } else {
                req.user = user
            }
        })
        next()
    } else {
        console.log('Inicia sesion')
        next()
    }
}

export const forceAuth = (req, res, next) => {
    const token = req.cookies.authToken
    
    if (!token) {
        return res.redirect('/login')
    }
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.redirect('login')
        }
        
        req.user = user
        next()
    })
}

export const notAuth = (req, res, next) => {
    const token = req.cookies.authToken
    if (token){
        console.log({
            status: 'error',
            message: 'Usuario autenticado'
        })
        res.redirect('/')
    }
}

