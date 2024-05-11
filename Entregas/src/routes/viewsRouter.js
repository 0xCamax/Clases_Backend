import { Router } from "express";
import { ProductManager } from "../dao/ProductManager.js"
import path from "path"
import { io } from "../main.js";


export const router = Router()

const productManager = new ProductManager(path.resolve("src", "datos", "productos.json"))


router.get("/", (req, res) => {
    res.render("index")
})

router.get("/home", async (req,res)=> {
    let productos = await productManager.getProducts()
    res.render("home",{ 
        productosLength: productos.length > 0,
        productos
    })
})

router.get("/realtimeproducts", async (req, res) => {
    let productos = await productManager.getProducts()
    res.render("realTime", {
            productosLength: productos.length > 0,
            productos
    })
})

router.get('/productos', async (req, res) => {
    let { sort } = req.query
    if (sort === "asc") req.query["sort"] = {precio: 1}
    if (sort === "desc") req.query["sort"] = {precio: -1}
    let { docs } = await productManager.paginate(req.query)
    io.emit('pagination', req.query)
    console.log(docs)
    res.render('productos', {
        productosLength: docs.length > 0,
        docs
    })
})

router.get('/carrito', async (req, res) => {
    res.render('carrito')
})


