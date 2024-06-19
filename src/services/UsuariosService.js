import { UsuariosDAO } from "../dao/UsuariosDAO.js"
import { carritoManager } from "./CarritoService.js"

class UsuariosImpl extends UsuariosDAO{
    async findOrCreate(filtro, info) {
        let user = await this.getBy(filtro)
        if (!user) {
            user = await this.create({
                ...info,
                carrito: await carritoManager.create()
            })
            return user
        } else {
            return user
        }
    }
}

export const usuariosManager = new UsuariosImpl()