import { Usuario } from "../dao/models/usuariosModel.js"

export const onlyAdmin = (req, res, next) => {
    try {
        let { usuario } = req.body
        if(usuario.role !== "admin"){
            throw new Error('Not allowed')
        }
        next()
    } catch (err) {
        res.status(403).json({ 
            error: err.message 
        })
    }
}