const path = require("path")
const ProductManager = require("./Desafios")
const fs = require("fs")

let producto;

const entorno = async () => {
    try {
        producto = new ProductManager(path.join(__dirname, "productos.json")) 
        await fs.promises.writeFile(producto.path, "[]")
    } catch (error) {
        console.log(error.message)
        return         
    }
}

entorno()



producto.addProduct("producto prueba", "Este es el producto prueba", 200, "Sin imagen", "abc123", 25)
producto.addProduct("producto prueba", "Este es el producto prueba", 200, "Sin imagen", "abc125", 25)
producto.addProduct("producto prueba", "Este es el producto prueba", 200, "Sin imagen", "abc124", 25)
producto.addProduct("producto prueba", "Este es el producto prueba", 200, "Sin imagen", "abc126", 25)
producto.addProduct("producto prueba", "Este es el producto prueba", 200, "Sin imagen", "abc128", 25)



producto.updateProduct(2, modificar={price: 300})
producto.delProduct(4)





