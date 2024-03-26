const express = require("express")
const ProductManager = require("./Desafios")
const path = require("path")



const PORT = 3005
const app = express()


let productManager = new ProductManager(path.join(__dirname, "./datos/productos.json"))


const entorno = async () => {
        await productManager.addProduct("hola", "comoesta", 200, "no img", "abc123", 10)
        await productManager.addProduct("hola", "comoesta", 200, "no img", "abc124", 10)
        await productManager.addProduct("hola", "comoesta", 200, "no img", "abc125", 10)
        await productManager.addProduct("hola", "comoesta", 200, "no img", "abc126", 10)
        await productManager.addProduct("hola", "comoesta", 200, "no img", "abc127", 10)
        await productManager.addProduct("hola", "comoesta", 200, "no img", "abc128", 10)
        await productManager.addProduct("hola", "comoesta", 200, "no img", "abc129", 10)
        await productManager.addProduct("hola", "comoesta", 200, "no img", "abc130", 10)
        await productManager.file()
    return productManager.getProducts()
}
const startServer = async () => {
    const producto = await entorno()
        app.get("/", (req, res) => {
            res.send("Hola")
        })

        app.get("/products", (req, res) => {
            let {limit} = req.query
            if (limit > 0) {
                let respuesta = producto.slice(0, limit)
                res.json(respuesta)
            } else {
                res.json(respuesta)
            }
        })

        app.get("/products/:id", (req, res) => {
                let {id} = req.params
                let respuesta = producto.filter(prod => prod.id == id)
                res.json(respuesta)
        })

        app.listen(PORT, () => {
            console.log(`Servidor online en PORT ${PORT}`)
        })
 }

startServer()
