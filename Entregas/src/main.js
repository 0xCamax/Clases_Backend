import express from "express"
import { router as productosRouter } from "./routes/productosRouter.js"
import { router as carritoRouter } from "./routes/carritoRouter.js"
import { ProductManager } from "./dao/ProductManager.js"
import path from "path"
import { CarritoManager } from "./dao/CarritoManager.js"




const PORT = 8080
const main = express()

export const  productManager = new ProductManager(path.resolve("src","datos", "productos.json"))
export const carritoManager = new CarritoManager(path.resolve("src","datos", "carritos.json"))


main.use(express.json())
main.use(express.urlencoded({extended:true}))
main.use("/api/products", productosRouter)
main.use("/api/carrito", carritoRouter)


main.listen(PORT, ()=>{
    console.log(`Server online en el puerto ${PORT}`)
})

