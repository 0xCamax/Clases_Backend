import { Router } from "express";
import { ProductManager } from "../dao/ProductManager.js"
import { carritoManager } from "./carritoRouter.js";


export const router = Router()

const productManager = new ProductManager()


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
    let {sort, query} = req.query
    let queryParams = req._parsedUrl.search
    let api = 'http://localhost:8080/api/producto' + (queryParams ? queryParams : '')
    let response = await fetch(api, {
        method: 'GET',
        headers: {
            'X-Client-Url': req.protocol + '://' + req.get('host') + req.originalUrl
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
})

//663deaa4e7757e6f53b47bed carrito hardcodeado 
//se tomara en base al login mas adelante
router.get('/carrito/:cid', async (req, res) => {
    let { cid } = req.params
    let { productos } = await carritoManager.getCid(cid)
    //no me deja agregar nueva propiedad total a cada prod a si que creare un nuevo array para poder renderizar
    let show = []
    productos.forEach(p => {
        p.total = p.cantidad * p.pid.precio
    })
    let totalCarrito = productos.reduce((acum, num) => num.total + acum, 0)
    res.render('carrito', {
        productosLength: productos.length > 0,
        cid,
        productos,
        show, 
        totalCarrito
    })
})


