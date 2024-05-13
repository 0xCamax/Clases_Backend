import { Router } from "express";
import { productManager } from "../dao/ProductManager.js"
import { carritoManager } from "../dao/CarritoManager.js"


export const router = Router()


router.get("/", (req, res) => {
    res.render("index")
})

router.get("/home", async (req,res)=> {
    try {
        let productos = await productManager.getProducts()
        res.render("home",{ 
            productosLength: productos.length > 0,
            productos
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
        let productos = await productManager.getProducts()
        res.render("realTime", {
            productosLength: productos.length > 0,
            productos
        })
    } catch (err) {
        console.log(err)
        res.render("error", {
            err
        })
    }
})

router.get('/productos', async (req, res) => {
    try {

        let {sort, query} = req.query
        let queryParams = req._parsedUrl.search
        let api = 'http://localhost:8080/api/producto' + (queryParams ? queryParams : '')
        console.log(req)
        let response = await fetch(api, {
            method: 'GET',
            headers: {
                'X-Client-Url': req.protocol + '://' + req.get('host') + req._parsedOriginalUrl.pathname
            }
        })
        let data = await response.json()
        let { payload, hasPrevPage, hasNextPage, totalPages, page, totalDocs, prevPage, nextPage, limit, prevLink, nextLink } = data
        let paginas = []
        for (let i = 1; i <= totalPages; i++) paginas.push(i)
        let from = (page - 1) * limit + 1
        let to = from + payload.length - 1
    
    res.render('productos', {
        productosLength: payload.length > 0,
        total: totalPages > 1,
        from,
        to,
        productos: payload,
        hasNextPage,
        hasPrevPage,
        page,
        totalPages,
        totalDocs,
        paginas,
        prevPage,
        nextPage,
        prevLink,
        nextLink,
        limit,
        sort,
        query
    })
    } catch (err) {
        console.log(err)
        res.render("error", {
            err
        })
    }
})

//663deaa4e7757e6f53b47bed carrito hardcodeado 
//se tomara en base al login mas adelante
router.get('/carrito/:cid', async (req, res) => {
    try {
        let { cid } = req.params
        let { productos } = await carritoManager.getCid(cid)
        productos.forEach(p => {
            p.total = p.cantidad * p.pid.precio
        })
        let totalCarrito = productos.reduce((acum, num) => num.total + acum, 0)
        res.render('carrito', {
            productosLength: productos.length > 0,
            cid,
            productos, 
            totalCarrito
        })
    } catch (err){
        console.log(err)
        res.render('error', {
            err
        })
    }
})


