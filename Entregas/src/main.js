import express from "express"
import { router as productosRouter } from "./routes/productosRouter.js"
import { router as carritoRouter } from "./routes/carritoRouter.js"
import path from "path"
import { Server } from "socket.io"
import  handlebars  from "express-handlebars"
import { router as viewsRouter } from "./routes/viewsRouter.js"
import mongoose from "mongoose"



const PORT = 8080
const main = express()
const server = main.listen(PORT, ()=>{
    console.log(`Server online en el puerto http://localhost:${PORT}`)
})

const hbs = handlebars.create({
    defaultLayout: "main",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})

mongoose.connect('mongodb+srv://CoderHouse:coder.123321@cluster0.uz3kvfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

main.use(express.json())
main.use(express.urlencoded({extended:true}))
main.engine("hbs", hbs.engine)
main.set("views", path.resolve("src", "views"))
main.set("view engine", "hbs")
main.use(express.static(path.resolve("src", "public")))
main.use("/api/products", productosRouter)
main.use("/api/carrito", carritoRouter)
main.use("/", viewsRouter)

export const io = new Server(server)

io.on("connection", socket => {
    console.log("cliente conectado")
})


