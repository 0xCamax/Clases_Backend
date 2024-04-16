import { Router } from "express";
import { ProductManager } from "../dao/ProductManager.js"
import path from "path"

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