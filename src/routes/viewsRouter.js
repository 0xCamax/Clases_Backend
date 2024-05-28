import { Router } from "express";
import { productManager } from "../dao/ProductManager.js"
import { carritoManager } from "../dao/CarritoManager.js"
import { forceAuth, notAuth } from "../middleware/auth.js";

export const router = Router()

router.get("/", (req, res) => {
    let user = req.user
    res.render("index", {
        layout: 'main',
        title: 'Coder',
        user

    })
})

router.get('/login', notAuth, (req, res) => {
    res.render('login')
})

router.get("/home", async (req,res)=> {
    try {
        let user = req.user
        let productos = await productManager.getProducts()
        res.render("home",{ 
            productosLength: productos.length > 0,
            productos,
            user
        })
    } catch (err) {
        console.log(err)
        res.render("error", {
            err
        })
    }
})

router.get("/realtimeproducts", async (req, res) => {
    try {
        let user = req.user
        let productos = await productManager.getProducts()
        res.render("realTime", {
            productosLength: productos.length > 0,
            productos,
            user
        })
    } catch (err) {
        console.log(err)
        res.render("error", {
            err
        })
    }
})

router.get('/productos', async (req, res) => {
    let user = req.user
    let api = 'http://localhost:8080/api/producto'
    let response = await fetch(api, {
        method: 'GET'
    })
    let data = await response.json()
    let { categorias, totalPages, page, nextLink, prevLink, payload, totalDocs, limit, hasNextPage, hasPrevPage } = data

    let paginas = []
    for (let i = 1; i <= totalPages; i++) paginas.push(i)
    let from = (page - 1) * limit + 1
    let to = from + payload.length - 1
    
    res.render('productos', {
        productosLength: payload.length > 0,
        total: paginas.length != 0,
        categorias,
        paginas,
        page,
        nextLink,
        prevLink,
        productos: payload,
        totalDocs,
        from,
        to,
        hasNextPage,
        hasPrevPage,
        api,
        limit,
        user
    })
})

router.get('/carrito', forceAuth, async (req, res) => {
    try {
        const user = req.user
        const { cart: cid } = user

        const api = 'http://localhost:8080/api/carrito/'+cid
        const carritos = await fetch(api, {
            method: 'get'
        })
        const { payload: { productos } } = await carritos.json()

        productos.forEach(p => {
            p.total = p.cantidad * p.pid.precio
        })
        let totalCarrito = productos.reduce((acum, num) => num.total + acum, 0)
        res.render('carrito', {
            productosLength: productos.length > 0,
            cid,
            productos, 
            totalCarrito,
            user
        })
    } catch (err){
        console.log(err)
        res.render('error', {
            err
        })
    }
})

router.get('/perfil', forceAuth, async (req, res) => {
    let user = req.user
    res.render('perfil', {
        user
    })
})


