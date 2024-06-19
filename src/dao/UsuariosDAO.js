import { Usuario } from "../models/usuariosModel.js"
import { carritoManager } from "../services/CarritoService.js"

export class UsuariosDAO {
    async create(info) {
        let usuario = new Usuario(info)
        await usuario.save()
        return await this.getBy(usuario)
    }

    async getBy(filtro) {
        return await Usuario.findOne(filtro).lean()
    }

    //update
    //delete
}

