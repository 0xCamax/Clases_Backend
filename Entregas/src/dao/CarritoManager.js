import { readFile, writeFile } from "fs/promises"
import { Carrito } from "./models/carritoModel.js"

export class CarritoManager {

    constructor(){
        this.carritos = []
    }

    async add(cid, pid, cantidad){
        if (!cid){
            let carrito = new Carrito()
            return await carrito.save()
        } else {
            let carrito = await this.getCid(cid)
            let index = carrito.productos.findIndex(p => p.pid == pid.toString())
            if (index !== -1){
                carrito.productos[index].cantidad += cantidad
            } else {
                carrito.productos.push({
                    pid: pid,
                    cantidad: cantidad
                })
            }
            await Carrito.updateOne({'_id':cid}, {productos: carrito.productos})
            return carrito
        }
    }

    async getCid(cid){
        return Carrito.findOne({'_id': cid})
    }

    async getCarritos(){
        try {
            this.carritos = await Carrito.find()
            return this.carritos
        } catch (error) {
            return this.carritos
        }
    }

    async deletePid(cid, pid, cantidad){
        let carrito = await this.getCid(cid)
        let index = carrito.productos.findIndex(p => p.pid == pid.toString())
        if (index == -1) {
            throw new Error(`No existe el producto ${pid}`)
        }
        carrito.productos[index].cantidad -= cantidad
        if (carrito.productos[index].cantidad <= 0) carrito.productos.splice(index, 1)
        await Carrito.updateOne({'_id':cid}, {productos: carrito.productos})
        return carrito
    }

    async deleteAll(cid) {
        await Carrito.updateOne({'_id': cid}, {productos: []})
        let carrito = await this.getCid(cid)
        return carrito
    }
}