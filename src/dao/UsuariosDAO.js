import { Usuario } from "../models/usuariosModel.js"

export class UsuariosDAO {
    async create(info) {
        try{
            return (await new Usuario(info).save()).toObject()
        } catch (err) {
            return console.log(err)
        }
    }

    async getBy(filtro) {
        try{
            return await Usuario.findOne(filtro).lean()
        } catch (err) {
            return console.log(err)
        }
    }

    //update
    //delete
}

