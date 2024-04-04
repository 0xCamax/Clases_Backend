import { readFile, writeFile } from "fs/promises"

export class CarritoManager {

    static CARRITO_ID = 0

    constructor(path){
        this.path = path
        this.carritos = []
    }

    async add(cid, pid, cantidad){
        if (!cid){
            await this.getCarritos()
            CarritoManager.CARRITO_ID = this.carritos[this.carritos.length -1] ? this.carritos[this.carritos.length -1].id +1 : 0
            let newCarrito = {
                id: CarritoManager.CARRITO_ID++,
                productos: []
            }
            this.carritos.push(newCarrito)
            
            writeFile(this.path, JSON.stringify(this.carritos, null, 4), "utf-8")
            return newCarrito
        } else {
            let carrito = await this.getCid(cid)
            let index = carrito.productos.findIndex(p => p.pid == pid)
            if (index !== -1){
                carrito.productos[index].cantidad += cantidad
            } else {
                carrito.productos.push({
                    pid: pid,
                    cantidad: cantidad
                })
            }
            writeFile(this.path, JSON.stringify(this.carritos, null, 4), "utf-8")
            return carrito
        }
    }

    async getCid(cid){
        await this.getCarritos()
        let carrito = this.carritos.filter(c => c.id == cid)[0]
        return carrito ? carrito : undefined
    }

    async getCarritos(){
        let json = await readFile(this.path, {encoding: "utf-8"})
        this.carritos = JSON.parse(json)
        return this.carritos
    }

    async deletePid(cid, pid, cantidad){
        let carrito = await this.getCid(cid)
        let index = carrito.productos.findIndex(p => p.pid == pid)
        carrito.productos[index].cantidad -= cantidad
        carrito.productos[index].cantidad <= 0 ? carrito.productos.splice(index, 1) : null
            
        writeFile(this.path, JSON.stringify(this.carritos, null, 4), "utf-8")
        return carrito
    }
}