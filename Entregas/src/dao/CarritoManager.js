import { Carrito } from "./models/carritoModel.js"

export class CarritoManager {

    async add(cid, pid, cantidad){
        try {
            if (!cid){
                let carrito = new Carrito()
                return await carrito.save()
            } else {
                let carrito = await this.getCid(cid)
                let index = carrito.productos.findIndex(p => p.pid._id == pid.toString())
                if (index !== -1){
                    carrito.productos[index].cantidad += Number(cantidad)
                } else {
                    carrito.productos.push({
                        pid: pid,
                        cantidad: cantidad
                    })
                }
                await Carrito.updateOne({'_id':cid}, {productos: carrito.productos})
                return carrito
            }
        } catch (err){
            return console.log(err)
        }
    }

    async getCid(cid){
        try {
            return await Carrito.findOne({'_id': cid}).populate('productos.pid').lean()
        } catch (err){
            console.log(err)
        }
    }

    async getCarritos(){
        try{
            return await Carrito.find().populate('productos.pid').lean()
        } catch (err){
            console.log(err)
        }
    }

    async deletePid(cid, pid, cantidad){
        try {
            let carrito = await this.getCid(cid)
            let index = carrito.productos.findIndex(p => p.pid._id == pid.toString())
            if (index == -1) {
                throw new Error(`No existe el producto ${pid}`)
            }
            carrito.productos[index].cantidad -= Number(cantidad)
            if (carrito.productos[index].cantidad <= 0) carrito.productos.splice(index, 1)
            await Carrito.updateOne({'_id':cid}, {productos: carrito.productos})
            return carrito
        } catch (err) {
            console.log(err)
        }
    }

    async deleteAll(cid) {
        try {
            await Carrito.updateOne({'_id': cid}, {productos: []})
            let carrito = await this.getCid(cid)
            return carrito
        } catch (err){
            console.log(err)
        }
    }
}