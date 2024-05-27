import { usuariosManager } from "../dao/UsuariosManager.js"
import { Strategy as GithubStrategy } from 'passport-github2'
import { Strategy as GoogleStrategy} from 'passport-google-oauth20'
import { Strategy as LocalStrategy } from "passport-local"
import passport from "passport"
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt"
import { GITHUB_SECRET, SECRET_KEY, GOOGLE_CID, GOOGLE_SECRET, GITHUB_CID } from "../config.js"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'



export const initPass = () => {
    passport.use(
        'jwt',
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([
                    (req) => {
                        return req.cookies.authToken ? req.cookies.authToken : null
                    }
                ]),
                secretOrKey: SECRET_KEY
            },
            async (jwt_payload, done) => {
                try {
                    const user = await usuariosManager.getBy({usuario: jwt_payload.usuario})
                    return done(null, user)
                } catch (err) {
                    return done(err, false)
                }
            }
        )
    )

    passport.use(
        new LocalStrategy(
            {
                usernameField: 'username',
                passwordField: 'password'
            },
            async (username, password, done) =>{
                try {
                    if(!password) throw new Error('Ingresa contraseña')
                    const hashedPw = await bcrypt.hash(password, 10)
                    const user = await usuariosManager.findOrCreate({usuario: username},
                        {
                            usuario: username,
                            pw: hashedPw
                        }
                    )

                    const match = await bcrypt.compare(password, user.pw)

                    if(!match) {
                        throw new Error('Contraseña invalida')
                    }
            
                    const token = jwt.sign({id: user.id, usuario: user.usuario}, SECRET_KEY, {expiresIn: '7d'})
                    return done(null, token)
                    
                } catch (err) {
                    return done(err)
                }
            }
        )
    )

    passport.use(
        'github',
        new GithubStrategy(
            {
                clientID: GITHUB_CID,
                clientSecret: GITHUB_SECRET,
                callbackURL: "http://localhost:8080/api/auth/github/callback"
            },
            async(tokenAcceso, tokenRefresh, profile, done) => {
                try{      
                    const usuario = profile.username           
                    const user = await usuariosManager.findOrCreate({usuario: usuario},
                        {
                            usuario: usuario,
                            provider: 'github' //en caso de que quiera mas propiedades irian aqui
                        }
                    )

                    const token = jwt.sign({id: user.id, usuario: user.usuario, carrito: user.carrito}, SECRET_KEY, {expiresIn: '7d'})
                    
                    return done(null, token)
                    
                } catch (err) {
                    return done(err)
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
            async (req, tokenAcceso, tokenRefresh, profile, done) => {
                try {
                    const usuario = profile._json.email.split('@')[0]
                    const user = await usuariosManager.findOrCreate({usuario: usuario},
                        {
                            usuario: usuario, //en caso de que quiera mas propiedades irian aqui
                            provider: 'google'
                        }
                    )
    
                    const token = jwt.sign({id: user._id, usuario: user.usuario, carrito: user.carrito}, SECRET_KEY, {expiresIn: '7d'})
    
                    return done(null, token)
                    
                } catch (err) {
                    return done(err)
                }
            }
        )
    )
}
