import { readFile, writeFile } from "fs/promises"

export class ProductManager {

    static PRODUCT_ID = 0

    constructor(path){
        this.path = path
        this.products = []
        this.validProps = ["titulo", "descripcion", "categoria", "precio", "imagen", "codigo", "stock", "status"]
    }

    async add(producto){

        let newProduct = {
            id: ProductManager.PRODUCT_ID++,
            status: true,
            ...producto
        }
        this.products.push(newProduct)
        await this.update()
        return newProduct
    }

    async update(pid, producto){
            if (pid){
                let update = await this.getPid(pid)
                if (update == "No existe") {
                    return update
                } else {
                    let updateProd = {
                        ...update,
                        ...producto,
                        id: update.id
                    }
                    let index = this.products.findIndex(p => p.id == pid)
                    this.products[index] = updateProd
                }
            }
            writeFile(this.path, JSON.stringify(this.products, null, 4), "utf-8")
            return
    }

    async delete(pid){
        let eliminar = await this.getPid(pid)
        this.products = this.products.filter(p => p.id != pid)
        await this.update()
        return eliminar
    }

    async getPid(pid){
        this.products = await this.getProducts()
        let producto = this.products.filter(p => p.id == pid)[0]
        return producto ? producto : "No existe"
    }

    async getProducts(){
        try {
            let json = await readFile(this.path, {encoding: 'utf-8'})
            this.products = JSON.parse(json)
            return this.products
        } catch (error) {
            return this.products
        }
    }
}


