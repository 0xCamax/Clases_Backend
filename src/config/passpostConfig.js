import { usuariosManager } from "../dao/UsuariosManager.js"
import { carritoManager } from "../dao/CarritoManager.js"
import { clientID, clientSecret } from "../config.js"
import github from 'passport-github2'
import passport from "passport"

export const initPass = () => {
    passport.use(
        'github',
        new github.Strategy(
            {
                clientID: clientID,
                clientSecret: clientSecret,
                callbackURL: "http://localhost:8080/api/user/callbackGithub"
            },
            async(tokenAcceso, tokenRefresh, profile, done) => {
                try{                 
                    let usuario = profile.username
                    let carrito = await carritoManager.add()
                    
                    let user = await usuariosManager.getBy({usuario: usuario})
                    
                    if (!user) {
                        await usuariosManager.create({usuario: usuario, carrito: carrito.id})
                        user = await usuariosManager.getBy({usuario: usuario})
                    }
                    
                    return done(null, user)
                    
                } catch (err) {
                    return done(err)
                }
            }
        )
    )
    passport.serializeUser((user, done)=>{
        return done(null, user._id)
    })

    passport.deserializeUser(async(id, done )=>{
        let user= await usuariosManager.getBy({_id:id})
        return done(null, user)
    })
}
