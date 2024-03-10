class ProductManager {

    static ID = 0

    constructor(){
        this.products = [];
    }

    addProduct (title, description, price, thumbnail, code, stock) {
        if(!title || !description || !price || !thumbnail || !code || !stock){
            return 'Ingresa todos los campos [title, description, price, thumbnail, code, stock]'
        }
        if (this.products.some(p => p.code == code)){
            return `${code} ya existe`
        } else {
            let id = ProductManager.ID + 1
            let nuevoProducto = {
            id: id, 
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
            }
            this.products.push(nuevoProducto)

        }
    }

    getProducts() {
        return this.products;
    }

    getProductsById(id) {
        let prod = this.products.find(p => p.id === id)
        return prod ? prod : "Not found"
    }

}

module.exports = ProductManager