import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config.js'

//para el router views

export const checkAuth = (req, res, next) => {
    const token = req.cookies.authToken

    if(token) {
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                console.log('Token inválido o expirado')
                res.cookie('authToken', '', { httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(0)})
                return res.redirect('/login')
            } else {
                req.user = user
            }
        })
        next()
    } else {
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
    next()
}

