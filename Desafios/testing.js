const path = require("path")
const ProductManager = require("./Desafios")
const fs = require("fs")

let producto;

const entorno = async () => {
    try {
        producto = new ProductManager(path.join(__dirname, "productos.json")) 
        await fs.promises.writeFile(producto.path, "[]")
        await producto.addProduct("producto prueba", "Este es el producto prueba", 200, "Sin imagen", "abc123", 25)
        await producto.addProduct("producto prueba", "Este es el producto prueba", 200, "Sin imagen", "abc125", 25)
        await producto.addProduct("producto prueba", "Este es el producto prueba", 200, "Sin imagen", "abc124", 25)
        await producto.addProduct("producto prueba", "Este es el producto prueba", 200, "Sin imagen", "abc126", 25)
        await producto.addProduct("producto prueba", "Este es el producto prueba", 200, "Sin imagen", "abc128", 25)
        await producto.updateProduct(2, modificar={price: 300})
        await producto.delProduct(4)
        console.log(await producto.getProducts())
    } catch (error) {
        console.log(error.message)
        return         
    }
}

entorno()









