import { Router } from "express"
import passport from "passport"
import { error, google_cb, login, logout, register, send_verification } from "../controller/authController.js"



export const router = Router()

router.get('/error', error)
router.post('/login', (req, res, next)=> {
    passport.authenticate('login', { session: false }, (err, user, info) => {
        if(err) {
            return res.status(400).json({ 
                status: 'error', 
                error: err
            })
        }
        req.user = user
        next()
    })(req, res, next)
}, login)
router.post('/registro', passport.authenticate('verify', { session: false }), register)
router.post('/send_verification', send_verification)
router.get('/logout', passport.authenticate('jwt', {session: false}), logout)
router.get('/google', passport.authenticate('google'))
router.get('/google/callback', passport.authenticate('google', { session: false }), google_cb)
