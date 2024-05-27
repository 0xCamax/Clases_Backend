import { Usuario } from "./models/usuariosModel.js"
import { carritoManager } from "./CarritoManager.js"

class UsuariosManager {

    async create(info) {
        let usuario = new Usuario(info)
        await usuario.save()
        return await this.getBy(usuario)
    }

    async getBy(filtro) {
        return await Usuario.findOne(filtro).lean()
    }

    async findOrCreate(filtro, info) {
        let user = await this.getBy(filtro)
        if (!user) {
            return this.create({
                ...info,
                carrito: await carritoManager.add()
            })
        } else {
            return user
        }
    }
}

export const usuariosManager = new UsuariosManager()

