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
        let validar = this.validar(producto, true)
        if(validar.length == 0){
            ProductManager.PRODUCT_ID = this.products[this.products.length -1] ? this.products[this.products.length -1].id +1 : 0
            let newProduct = {
                id: ProductManager.PRODUCT_ID++,
                status: true,
                ...producto
            }
            this.products.push(newProduct)
            await this.update()
            return newProduct
        } else {
            throw new Error(`${validar.join(' | ')}`)
        }
    }

    async update(pid, producto){
        if (pid){
            let validar = this.validar(producto)
            if (validar.length == 0) {
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
            } else {
                throw new Error(`${validar.join(" | ")}`)
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
        let errores = []
        const invalidProp = Object.keys(input).filter(k => !this.validProps.hasOwnProperty(k))
        const invalidType = Object.entries(input)
            .filter(([k, v]) => this.validProps.hasOwnProperty(k) && typeof v !== this.validProps[k])
            .map(([k]) => k)
        if (input["codigo"]) {
            if (this.products.some(p => p.codigo == input["codigo"])) {
                errores.push("codigo repetido")
            }
        }
        if (input["imagen"]) {
            let invalidIMG = Array.isArray(input.imagen) ? input.imagen.some(img => typeof img !== "string") : true
            invalidIMG ? new Set(invalidType, "imagen") : null
        }
        if (invalidProp.length > 0) {
            errores.push(`Propiedad invalida: ${invalidProp.join(", ")}`)
            
        }
        if (invalidType.length > 0){
            errores.push(`TypeError: ${invalidType.join(", ")}`)
        }
        if (strict) {
            delete this.validProps.status
            if(Object.keys(input).length < Object.keys(this.validProps).length) {
                let missing = Object.keys(this.validProps).filter(k => !Object.keys(input).includes(k))
                errores.push(`Informacion incompleta: ${missing.join(", ")}`)
            }
        }
            return errores
        }
    }



