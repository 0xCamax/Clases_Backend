import { readFile, writeFile } from "fs/promises"

export class CarritoManager {

    static CARRITO_ID = 0

    constructor(path){
        this.path = path
        this.carritos = []
        this.validProps = ["id","cantidad"]
    }

    async add(cid, pid, cantidad){
        if (!cid){
            let newCarrito = {
                id: CarritoManager.CARRITO_ID++,
                productos: []
            }
            this.carritos.push(newCarrito)
            
            writeFile(this.path, JSON.stringify(this.carritos, null, 4), "utf-8")
            return `Se creo un nuevo carrito CID: ${newCarrito.id}`
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
            return `Se agregaron ${cantidad} pid: ${pid} al carrito CID: ${cid}`
        }

    }

    async getCid(cid){
        try {
            let json = await readFile(this.path, {encoding: 'utf-8'})
            this.carritos = JSON.parse(json)
            let carrito = this.carritos.filter(c => c.id == cid)[0]
            return carrito ? carrito : undefined
        } catch (error) {
            return          
        }
    }
}