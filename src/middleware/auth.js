import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config.js';

export const auth = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Usuario no autenticado'
        })
    }
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token')
        }
        
        req.user = user
        next()
    })
}

