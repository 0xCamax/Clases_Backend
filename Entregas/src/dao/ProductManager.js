import { Product } from "./models/productsModel.js"

export class ProductManager {

    constructor(){
        this.products = []
    }

    async add(producto){
        let newProduct = new Product({
            ...producto
        })
        return await newProduct.save()
    }

    async update(pid, producto){
        await Product.updateOne({'_id':pid}, producto)
        return await this.getPid(pid)
    }

    async delete(pid){
        return await Product.findOneAndDelete({'_id': pid})
    }

    async getPid(pid){
        return await Product.findOne({'_id': pid})
    }

    async getProducts(){
        try {
            this.products = await Product.find()
            return this.products
        } catch (error) {
            return this.products
        }
    }
    async paginate(options) {
        if (options.query) return await Product.paginate({'categoria': options.query}, options)
        return await Product.paginate({}, options)
    }
}



