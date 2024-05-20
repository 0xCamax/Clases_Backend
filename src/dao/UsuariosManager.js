import { Usuario } from "./models/usuariosModel.js"

class UsuariosManager {

    async create(info) {
        let usuario = new Usuario(info)
        return await usuario.save()
    }

    async getBy(filtro) {
        return await Usuario.findOne(filtro).lean()
    }
}

export const usuariosManager = new UsuariosManager()

