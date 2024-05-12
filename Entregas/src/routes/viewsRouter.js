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
    let { sort } = req.query
    if (sort === "asc") req.query["sort"] = {precio: 1}
    if (sort === "desc") req.query["sort"] = {precio: -1}
    let { docs, hasPrevPage, hasNextPage, totalPages, page, totalDocs, prevPage, nextPage, limit} = await productManager.paginate(req.query)
    let paginas = []
    for (let i = 1; i <= totalPages; i++) paginas.push(i)
    let from = (page - 1) * limit + 1
    let to = from + docs.length - 1

    res.render('productos', {
        productosLength: docs.length > 0,
        total: totalPages > 1,
        from,
        to,
        docs,
        hasNextPage,
        hasPrevPage,
        page,
        totalPages,
        totalDocs,
        paginas,
        prevPage,
        nextPage,
        limit
    })
})

//663deaa4e7757e6f53b47bed carrito hardcodeado 
//se tomara en base al login mas adelante
router.get('/carrito/:cid', async (req, res) => {
    let { cid } = req.params
    let { productos } = await carritoManager.getCid(cid)
    //no me deja agregar nueva propiedad total a cada prod a si que creare un nuevo array para poder renderizar
    let show = []
    productos.forEach((p, i) => {
        let r = {
            ...p._doc.pid._doc,
            cantidad: productos[i].cantidad,
            total: productos[i].cantidad * p._doc.pid._doc.precio
        }
        show.push(r)
    })
    let totalCarrito = show.reduce((acum, num) => num.total + acum, 0)
    res.render('carrito', {
        productosLength: productos.length > 0,
        cid,
        productos,
        show, 
        totalCarrito
    })
})


