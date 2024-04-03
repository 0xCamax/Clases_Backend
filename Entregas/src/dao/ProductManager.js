import { readFile, writeFile } from "fs/promises"

export class ProductManager {

    static PRODUCT_ID = 0

    constructor(path){
        this.path = path
        this.products = []
        this.validProps = {titulo: "string", descripcion: "string", categoria: "string", precio: "number", imagen:"object", codigo:"string", stock:"number", status: "boolean"}
    }

    async add(producto){
        await this.getProducts()
        if(this.validar(producto, true)){
            ProductManager.PRODUCT_ID = this.products[this.products.length -1] ? this.products[this.products.length -1].id : 0
            let newProduct = {
                id: ++ProductManager.PRODUCT_ID,
                status: true,
                ...producto
            }
            this.products.push(newProduct)
            await this.update()
            return newProduct
        } else {
            throw new Error("Input invalido")
        }
    }

    async update(pid, producto){
        if (pid){
            if (this.validar(producto)) {
                let update = await this.getPid(pid)
                if (!update) {
                    return update
                } else {
                    let updateProd = {
                        ...update,
                        ...producto,
                        id: update.id
                    }
                    let index = this.products.findIndex(p => p.id == pid)
                    this.products[index] = updateProd
                    writeFile(this.path, JSON.stringify(this.products, null, 4), "utf-8")
                    return {updateProd, update}
                }
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
        return producto
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

    validar (input, strict) {
        let valid = true
        const invalidProp = Object.keys(input).filter(k => !this.validProps.hasOwnProperty(k))
        const invalidType = Object.entries(input)
            .filter(([k, v]) => this.validProps.hasOwnProperty(k) && typeof v !== this.validProps[k])
            .map(([k]) => k)
        if (input["codigo"]) {
            if (this.products.some(p => p.codigo == input["codigo"])) {
                console.log("Codigo repetido")
                valid = false
            }
        }
        if (input["imagen"]) {
            let invalidIMG = input.imagen.some(img => typeof img !== "string")
            invalidIMG ? invalidType.push("imagen") : null
        }
        if (invalidProp.length > 0) {
            console.log(`Propiedad invalida: ${invalidProp.join(", ")}`)
            valid = false
        }
        if (invalidType.length > 0){
            console.log(`TypeError: ${invalidType}`)
            valid = false
        }
        if (strict) {
            delete this.validProps.status
            if (Object.keys(input).length !== Object.keys(this.validProps).length){
                console.log("Informacion incompleta")
                valid = false
            }
        }
        return valid
    }

}


