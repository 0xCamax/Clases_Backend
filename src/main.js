import { router as productosRouter } from "./routes/productosRouter.js"
import { router as carritoRouter } from "./routes/carritoRouter.js"
import { router as userRouter } from "./routes/userRouter.js"
import { router as viewsRouter } from "./routes/viewsRouter.js"
import  handlebars  from "express-handlebars"
import { Server } from "socket.io"
import mongoose from "mongoose"
import express from "express"
import path from "path"
import { BD } from "./dao/data.js"
import cookieParser from "cookie-parser"
import 'dotenv/config.js'

const PORT = 8080
const main = express()
const server = main.listen(PORT, ()=>{
    console.log(`Server online en el puerto http://localhost:${PORT}/`)
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
main.use(cookieParser())
main.engine("hbs", hbs.engine)
main.set("views", path.resolve("src", "views"))
main.set("view engine", "hbs")
main.use(express.static(path.resolve("src", "public")))


main.use("/api/producto", productosRouter)
main.use("/api/carrito",  carritoRouter)
main.use("/api/user", userRouter)
main.use("/", viewsRouter)

export const io = new Server(server)

io.on("connection", socket => {
    console.log("cliente conectado")
})

const enviroment = async () => {
    try {
        await mongoose.connect('mongodb+srv://CoderHouse:coder.123321@cluster0.uz3kvfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        console.log('Conexion a BD lista')
        let isEmpty = await BD.isEmpty()
        if(isEmpty && mongoose.connection.readyState === 1){
            await BD.crearProductos(10000)
            console.log('Datos creados')
        }
    } catch (err) {
        console.log(err)
    }
}

enviroment()

