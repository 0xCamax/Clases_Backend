import express from "express"
import { router as productosRouter } from "./routes/productosRouter.js"
import { router as carritoRouter } from "./routes/carritoRouter.js"
import path from "path"
import { Server } from "socket.io"
import  handlebars  from "express-handlebars"
import { router as viewsRouter } from "./routes/viewsRouter.js"
import { Socket } from "dgram"


const PORT = 8100
const main = express()
const server = main.listen(PORT, ()=>{
    console.log(`Server online en el puerto http://localhost:${PORT}`)
})
const io = new Server(server)

main.use(express.json())
main.use(express.urlencoded({extended:true}))
main.engine("hbs", handlebars.engine())
main.set("views", path.resolve("src", "views"))
main.set("view engine", "hbs")
main.use(express.static(path.resolve("src", "public")))
main.use("/api/products", productosRouter)
main.use("/api/carrito", carritoRouter)
main.use("/", viewsRouter)


io.on("connection", socket => {
    console.log("cliente conectado")
    socket.on("nuevoProducto", (data)=>{
        io.emit("agregarProducto", data)
    })
    socket.on("eliminarProducto", (data)=> {
        io.emit("eliminar", data)
    })
})


