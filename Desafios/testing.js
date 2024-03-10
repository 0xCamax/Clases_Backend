const ProductManager = require("./Desafio_1")


let producto = new ProductManager()

console.log(producto.getProducts())

producto.addProduct("producto prueba", "Este es el producto prueba", 200, "Sin imagen", "abc123", 25)
console.log(producto.addProduct("producto prueba", "Este es el producto prueba", 200, "Sin imagen", "abc123", 25))

console.log(producto.getProducts())
console.log(producto.getProductsById(2))