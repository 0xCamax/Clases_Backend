import { usuariosManager } from "../dao/UsuariosManager.js"
import { Strategy as GoogleStrategy} from 'passport-google-oauth20'
import { Strategy as LocalStrategy, Strategy } from "passport-local"
import passport from "passport"
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt"
import { SECRET_KEY, GOOGLE_CID, GOOGLE_SECRET } from "../config/config.js"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'


export const initPass = () => {
    passport.use(
        'jwt',
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([
                    (req) => {
                        const token = req.cookies.authToken ? req.cookies.authToken : req.query.authToken
                        return token
                    }
                ]),
                secretOrKey: SECRET_KEY
            },
            async (jwt_payload, done) => {
                    
                    return done(null, jwt_payload)
            }
        )
    )
    passport.use(
        'verify',
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([
                    (req) => {
                        return req.cookies.code
                    }
                ]),
                secretOrKey: SECRET_KEY
            },
            async (jwt_payload, done) => {
                return done(null, jwt_payload)
            }
        )
    )

    passport.use(
        'login',
        new LocalStrategy(
            {
                usernameField: 'username',
                passwordField: 'password',
            },
            async (username, password, done) =>{
                try {
                    let user = null
                    if(username.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)){
                        user = await usuariosManager.getBy({email: username})
                        if(!user) throw new Error('Email no registrado')
                    } else {
                        user = await usuariosManager.getBy({usuario: username})
                        if(!user) throw new Error('Usuario no registrado')
                    }
                    const match = await bcrypt.compare(password, user.pw)
                    if(!match) {
                        throw new Error('Contraseña invalida')
                    }

                    return done(null, user)
                    
                } catch (err) {
                    return done(err.message)
                }
            }
        )
    )

    passport.use(
        'google',
        new GoogleStrategy(
            {
                clientID: GOOGLE_CID,
                clientSecret: GOOGLE_SECRET,
                callbackURL:'http://localhost:8080/api/auth/google/callback',
                scope: ['profile', 'email'],
            },
            async (tokenAcceso, tokenRefresh, profile, done) => {
                try {
                    const usuario = profile._json.email.split('@')[0]
                    const user = await usuariosManager.findOrCreate({usuario: usuario},
                        {
                            usuario: usuario, //en caso de que quiera mas propiedades irian aqui
                            email: profile._json.email,
                            provider: 'google'
                        }
                    )

                    const token = jwt.sign({id: user.id, name: user.usuario, cart: user.carrito, rol: user.rol}, SECRET_KEY, {expiresIn: '7d'})
    
                    return done(null, token)
                    
                } catch (err) {
                    console.log(err)
                    return done(err.message)
                }
            }
        )
    )
}
