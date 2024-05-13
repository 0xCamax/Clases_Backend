import { Product } from "./models/productsModel.js"

class ProductManager {

    async add(producto){
        try {
            let newProduct = new Product({
                ...producto
            })
            return await newProduct.save()
        } catch (err) {
            console.log(err)
        }
    }

    async update(pid, producto){
        try {
            await Product.updateOne({'_id':pid}, producto)
            return await this.getPid(pid)
        } catch (err){
            console.log(err)
        }
    }

    async delete(pid){
        try {
            return await Product.findOneAndDelete({'_id': pid})
        } catch (err) {
            console.log(err)
        }
    }

    async getPid(pid){
        try {
            return await Product.findOne({'_id': pid})
        } catch (err) {
            console.log(err)
        }
    }

    async getProducts(){
        try {
            return await Product.find()
        } catch (err) {
            console.log(err)
            return []
        }
    }
    async paginate(options) {
        try {
            if (options.query) return await Product.paginate({'categoria': options.query}, options)
            return await Product.paginate({}, options)
        } catch (err) {
            console.log(err)
        }
    }
}

export const productManager = new ProductManager()