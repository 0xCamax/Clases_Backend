import { Router } from "express";
import { forceAuth, notAuth } from "../middleware/auth.js";

export const router = Router()

router.get("/", (req, res) => {
    let user = req.user
    res.render("index", {
        layout: 'main',
        title: 'Coder',
        user: user? (user.username ? user.username : user._id) : null,
        carrito: user? user.carrito : null
    })
})

router.get('/login', notAuth, (req, res) => {
    res.render('login')
})
router.get('/registro', notAuth, (req, res) => {
    res.render('registro')
})

router.get("/home", async (req,res)=> {
    try {
        let user = req.user
        let api = 'http://localhost:8080/api/producto'
        const get_products = await fetch(api, {
            method: 'GET'
        })
        const data = await get_products.json()
        const productos = data.payload
        res.render("home",{ 
            productosLength: productos.length > 0,
            productos,
            user: user? (user.username ? user.username : user._id) : null
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
        let api = 'http://localhost:8080/api/producto'
        const get_products = await fetch(api, {
            method: 'GET'
        })
        const data = await get_products.json()
        const productos = data.payload
        res.render("realTime", {
            productosLength: productos.length > 0,
            productos,
            user: user? (user.username ? user.username : user._id) : null
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
        user: user? (user.username ? user.username : user._id) : null,
        carrito: user? user.carrito : null
    })
})

router.get('/carrito', forceAuth, async (req, res) => {
    try {
        const user = req.user
        const { carrito: cid } = user

        const api = 'http://localhost:8080/api/carrito/'+cid
        const carritos = await fetch(api, {
            method: 'get'
        })

        const data = await carritos.json()
        const { productos } = data.payload

        productos.forEach(p => {
            p.total = p.cantidad * p.pid.precio
        })
        let totalCarrito = productos.reduce((acum, num) => num.total + acum, 0)
        res.render('carrito', {
            productosLength: productos.length > 0,
            cid,
            productos, 
            totalCarrito,
            user: user? (user.username ? user.username : user._id) : null
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
        user: user? (user.username ? user.username : user._id) : null
    })
})


