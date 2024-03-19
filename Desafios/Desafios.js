const fs = require("fs")

class ProductManager {
    #products
    
    static ID = 0
    
    constructor(path){
        this.path = path;
        this.#products = []
    }

    async addProduct (title, description, price, thumbnail, code, stock) {
        if(!title || !description || !price || !thumbnail || !code || !stock){
            return 'Ingresa todos los campos [title, description, price, thumbnail, code, stock]'
        }
        if (this.#products.some(p => p.code == code)){
            console.log(`${code} ya existe`)
        } else {
            let id = ++ProductManager.ID 
            let nuevoProducto = {
            id: id, 
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
            }
            this.#products.push(nuevoProducto)
        }
        let prodJSON = JSON.stringify(this.#products, null, 4)
        await fs.promises.writeFile(this.path, prodJSON, 'utf8');
    }


    async delProduct(id) {
        try {
            let delProd = await this.getJSON()
            const nuevoJSON = delProd.filter(prod => prod.id !== id);
            const acutualizarJSON = JSON.stringify(nuevoJSON, null, 4);
            await fs.promises.writeFile(this.path, acutualizarJSON, 'utf-8');
            console.log(`Objeto con ID ${id} eliminado correctamente.`);
        } catch (error) {
            console.error('Error al eliminar el objeto:', error);
        }
    }


    async updateProduct(id, modificar = {}) {
        let propiedadesValidas = ["title", "descripcion", "price", "thumbnail", "code", "stock"]
        let propiedades = Object.keys(modificar)
        let valido = propiedades.every(prop => propiedadesValidas.includes(prop))
        if (valido){
            let prodIndex = this.#products.findIndex(prod => prod.id == id)
            this.#products[prodIndex] = {
                ...this.getProductsById(id),
                ...modificar, 
                id: this.getProductsById(id).id
            }
        let prodJSON = JSON.stringify(this.#products, null, 4)
        await fs.promises.writeFile(this.path, prodJSON, 'utf8');
        console.log(`Se actualizo el producto ID: ${this.#products[prodIndex].id}`)
        } else {
            return console.log(`Las proiedades validas a modificar son: ${propiedadesValidas.join(", ")}`)
        }
        
    }

    getProducts() {
        return this.#products
    }

    
    getProductsById(id) {
        let prod = this.#products.find(p => p.id === id) 
        return prod ? prod : "Not found"
    }
    
    async setProductos () {
        try {
            this.#products = await this.getJSON()
        } catch (error) {
            console.log(error)
        }
    }
    
    async getJSON() {
        try {
            const fileExists = fs.existsSync(this.path)
            if (fileExists) {
                let prod = await fs.promises.readFile(this.path, "utf-8")
                const jsonProd = JSON.parse(prod)
                return jsonProd 
            } else {
                return []
            }
        } catch (error) {
            console.log(error)
        }
    }
}



module.exports = ProductManager