import { Product } from "../models/productsModel.js"

export class ProductManager {

    constructor(){
        this.products = []
    }

    async add(producto){
        this.products.push(producto)
        let newProduct = new Product({
            ...producto
        })
        return await newProduct.save()
    }

    async update(pid, producto){
        if (pid){
            let update = await this.getPid(pid)
            if (!update) {
                return update
            } else {
                let updateProd = await Product.updateOne({'_id':pid, producto})
                return {updateProd, update}
            }
        }
        return 
    }

    async delete(pid){
        let eliminar = Product.findOneAndDelete({'_id': pid})
        return eliminar
    }

    async getPid(pid){
        let producto = Product.findOne({'_id': pid})
        return producto
    }

    async getProducts(){
        try {
            this.products = await Product.find()
            return this.products
        } catch (error) {
            return this.products
        }
    }

    // validar (input, strict) {
    //     let validProps = {titulo: "string", descripcion: "string", categoria: "string", precio: "number", imagen:"object", codigo:"string", stock:"number", status: "boolean"}
    //     let errores = []
    //     if (strict) {
    //         delete validProps.status
    //         if(Object.keys(input).length < Object.keys(validProps).length || Object.values(input).some(v => !v)) {
    //             let missing = Object.keys(validProps).filter(k => !Object.keys(input).includes(k))
    //             let fillinfo = Object.entries(input).filter(([k,v])=> !v)
    //             fillinfo ? errores.push(`Informacion incompleta: ${fillinfo.join(" ")}`) : errores.push(`Informacion incompleta: ${missing.join(" ")}`)
    //         }
    //     }
    //     const invalidProp = Object.keys(input).filter(k => !validProps.hasOwnProperty(k))
    //     if (invalidProp.length > 0) {
    //         errores.push(`Propiedad invalida: ${invalidProp.join(", ")}`)
    //     } else {
    //         input.precio = Number(input.precio)
    //         input.stock = Number(input.stock)
    //     }
    //     const invalidType = Object.entries(input)
    //         .filter(([k, v]) => validProps.hasOwnProperty(k) && typeof v !== validProps[k])
    //         .map(([k]) => k)
            
    //     if (input["codigo"]) {
    //         if (this.products.some(p => p.codigo == input["codigo"])) {
    //             errores.push("codigo repetido")
    //         }
    //     }
    //     if (input["imagen"]) {
    //         let invalidIMG = Array.isArray(input.imagen) ? input.imagen.some(img => typeof img !== "string") : true
    //         invalidIMG ? new Set(invalidType, "imagen") : null
    //     }
    //     if (invalidType.length > 0){
    //         errores.push(`TypeError: ${invalidType.join(", ")}`)
    //     }
    //         return errores
    //     }
    }



