import { Router } from "express";
import { productManager } from "../dao/ProductManager.js"
import { io } from "../main.js";

export const router = Router()

router.get("/", async (req, res) => {
    try {
        let { sort } = req.query
        let clientUrl = req.headers['x-client-url']
        let search = req._parsedUrl.search
        let api = req.protocol + '://' + req.get('host') + req.baseUrl

        if (sort === "asc") req.query.sort = {precio: 1}
        if (sort === "desc") req.query.sort = {precio: -1}

        let options = {}
        Object.entries(req.query).forEach(([k,v]) => {
            if(k === "query" || k === "limit" || k === "sort" || k === "page"){
                options[k] = v
            }
        })

        let productos = await productManager.paginate(options)
        let categorias = await productManager.distinct('categoria')
        let {docs, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, totalDocs, limit, page} = productos

        let nextApi = search ? (search.match(/(page=)\d+/) ? api + search.replace(/(page=)\d+/, `$1${nextPage}`) : api + search + `&page=${nextPage}`) : api + `?page=${nextPage}`
        let prevApi = search ? (search.match(/(page=)\d+/) ? api + search.replace(/(page=)\d+/, `$1${prevPage}`) : api + search + `&page=${prevPage}`) : api + `?page=${prevPage}`

        io.emit('productos', {
            productos,
            nextApi,
            prevApi
        })

        res.setHeader("Content-Type", "aplication/json")
        return res.json({
            status: 'success',
            payload: docs,
            limit,
            page,
            totalDocs,
            totalPages,
            categorias,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            nextApi: hasNextPage ? nextApi : null,
            prevApi: hasPrevPage ? prevApi : null
        })
        
    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            status: 'error',
            payload: {
                error: "Error al mostrar productos"
            }
        })
    }
})

router.get("/:pid", async (req, res) => {
    try {
        let { pid } = req.params
        let producto = await productManager.getPid(pid)
        if(!producto){
            throw new Error(`No existe el producto ${pid}`)
        }
        res.setHeader("Content-Type", "aplication/json")
        return res.status(200).json({
            status: "success",
            payload: producto
        })

        } catch (error) {
            console.log(error)
            res.setHeader("Content-Type", "aplication/json")
            return res.status(500).json({
                status: 'error',
                payload: {
                    error: "Error al buscar producto"
                }
            })
        }
    }
)

//agregar
router.post("/", async (req, res) => {
    try {
        let newProduct = await productManager.add(req.body)
        io.emit("agregar", newProduct)
        res.setHeader("Content-Type", "aplication/json")
        return res.status(200).json({
            respuesta: "Se agrego el producto exitosamente",
            detalle: newProduct
        })
    } catch (error) {
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            status: 'error',
            payload: {
                error: "Error al agregar producto",
                detalle: error.message,
                body: req.body
            }
        })
    }
})

//update
router.put("/:pid", async (req, res) => {
    try {
        let { pid } = req.params

        let update = await productManager.update(pid, req.body)

        res.setHeader("Content-Type", "aplication/json")
        return res.status(200).json({
            status: "success",
            payload: {
                respuesta: "Producto modificado",
                modificacion: req.body,
                producto: update
            }
        })

    } catch (error) {
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            status: 'error',
            payload: {
                error: "Error al actualizar producto",
            }
        })
    }
})

//borrar
router.delete("/:pid", async (req, res)=> {
    try {
        let { pid } = req.params
        let eliminar = await productManager.delete(pid)
        
        if (!eliminar){
            throw new Error(`No existe id: ${pid}`)
        } else {
            io.emit("eliminar", eliminar)
            res.setHeader("Content-Type", "aplication/json")
            return res.status(200).json({
                status: 'success',
                payload: {
                    respuesta: `Producto eliminado`,
                    detalle: eliminar
                }
            })
        }
    } catch (error) {
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            status: 'error',
            payload: {
                error: "Error al eliminar producto",
                detalle: error.message
            }
        })
    }
})