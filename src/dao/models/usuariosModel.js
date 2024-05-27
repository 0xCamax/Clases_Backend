import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    usuario: {
        type: String,
        require: true,
        unique: true
    },
    pw: {
        type: String,
    },
    carrito: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carrito',
        require: true,
        _id: false
    },
    provider: {
        type: String,
        default: null
    },
    rol: {
        type: String,
        default: 'user'
    }
})

usuarioSchema.pre('save', function(next) {
    const user = this
    if (user.isNew || user.isModified('role')) {
        if (user.rol !== 'user' && user.rol !== 'admin') {
        return next(new Error('Invalid role'))
        }
        if (user.rol === 'admin') {
        return next()
        }
        if (!user.isNew && user.rol !== 'user') {
        user.rol = 'user'
        }
    }
    next()
    })

export const Usuario = mongoose.model('Usuario', usuarioSchema, 'Usuarios')