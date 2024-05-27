import { router as productosRouter } from "./routes/productosRouter.js"
import { router as carritoRouter } from "./routes/carritoRouter.js"
import { router as userRouter } from "./routes/authRouter.js"
import { router as viewsRouter } from "./routes/viewsRouter.js"
import  handlebars  from "express-handlebars"
import { Server } from "socket.io"
import mongoose from "mongoose"
import express from "express"
import path from "path"
import { BD } from "./dao/data.js"
import cookieParser from "cookie-parser"
import { initPass } from "./config/passportConfig.js"
import passport from "passport"
import { checkAuth } from "./middleware/auth.js"
import { MONGOOSE_URL, SECRET_KEY } from "./config.js"


const PORT = 8080
const main = express()

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

initPass()
main.use(passport.initialize())
main.use("/api/producto", productosRouter)
main.use("/api/carrito",  carritoRouter)
main.use("/api/auth", userRouter)
main.use("/", checkAuth, viewsRouter)

export let io;

const enviroment = async () => {
    try {
        console.log('Cargando BD...')
        await mongoose.connect(MONGOOSE_URL)
        console.log('Conexion a BD lista')
        let isEmpty = await BD.isEmpty()
        if(isEmpty && mongoose.connection.readyState === 1){
            await BD.crearProductos(10000)
            console.log('Datos creados')
        }
        const server = main.listen(PORT, ()=>{
            console.log(`Server online en el puerto http://localhost:${PORT}/`)
        })
        io = new Server(server)
        io.on('connect', socket => {
            console.log('Cliente conectado')
        })
    } catch (err) {
        console.log(err)
    }
}

enviroment()


