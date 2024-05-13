import { router as productosRouter } from "./routes/productosRouter.js"
import { router as carritoRouter } from "./routes/carritoRouter.js"
import { router as viewsRouter } from "./routes/viewsRouter.js"
import  handlebars  from "express-handlebars"
import { Server } from "socket.io"
import mongoose from "mongoose"
import express from "express"
import path from "path"



const PORT = 8080
const baseUrl = `http://localhost:${PORT}`
const main = express()
const server = main.listen(PORT, ()=>{
    console.log(`Server online en el puerto ${baseUrl}`)
})

const hbs = handlebars.create({
    defaultLayout: "main",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})
main.use(express.json())
main.use(express.urlencoded({extended:true}))
main.engine("hbs", hbs.engine)
main.set("views", path.resolve("src", "views"))
main.set("view engine", "hbs")
main.use(express.static(path.resolve("src", "public")))
main.use("/api/producto", productosRouter)
main.use("/api/carrito", carritoRouter)
main.use("/", viewsRouter)

export const io = new Server(server)

io.on("connection", socket => {
    console.log("cliente conectado")
})

const enviroment = async () => {
    try {
        await mongoose.connect('mongodb+srv://CoderHouse:coder.123321@cluster0.uz3kvfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        console.log('Conexion a BD lista')
    } catch (err) {
        console.log(err)
    }
}

enviroment()

