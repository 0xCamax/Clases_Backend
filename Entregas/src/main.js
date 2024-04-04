import express from "express"
import { router as productosRouter } from "./routes/productosRouter.js"
import { router as carritoRouter } from "./routes/carritoRouter.js"


const PORT = 8100
const main = express()


main.use(express.json())
main.use(express.urlencoded({extended:true}))
main.use("/api/products", productosRouter)
main.use("/api/carrito", carritoRouter)


main.listen(PORT, ()=>{
    console.log(`Server online en el puerto http://localhost:${PORT}`)
})

