import { UsuariosDAO } from "../dao/UsuariosDAO.js"
import CarritoService from "./CarritoService.js"

class UsuariosService extends UsuariosDAO{
    async findOrCreate(filtro, info) {
        let user = await this.getBy(filtro)
        if (!user) {
            user = await this.create({
                ...info,
                carrito: await CarritoService.create()
            })
            return user
        } else {
            return user
        }
    }
}

export default new UsuariosService()