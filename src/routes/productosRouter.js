import { Router } from "express";
import { productManager } from "../dao/ProductManager.js"
import { io } from "../main.js";

export const router = Router()

router.get("/", async (req, res) => {
    try {
        let { sort } = req.query
        let clientUrl = req.headers['x-client-url']
        let search = req._parsedUrl.search

        if (sort === "asc") req.query.sort = {precio: 1}
        if (sort === "desc") req.query.sort = {precio: -1}

        let options = {}
        Object.entries(req.query).forEach(([k,v]) => {
            if(k === "query" || k === "limit" || k === "sort" || k === "page"){
                options[k] = v
            }
        })

        let {docs, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, totalDocs, limit, page} = await productManager.paginate(options)

        let prevUrl = search ? (search.match(/(page=)\d+/) ? clientUrl + search.replace(/(page=)\d+/, `$1${prevPage}`) : clientUrl + search + `&page=${prevPage}`) : clientUrl + `?page=${prevPage}`
        let nextUrl = search ? (search.match(/(page=)\d+/) ? clientUrl + search.replace(/(page=)\d+/, `$1${nextPage}`) : clientUrl + search + `&page=${nextPage}`) : clientUrl + `?page=${nextPage}`
    

        res.setHeader("Content-Type", "aplication/json")
        return res.json({
            status: 'success',
            payload: docs,
            limit,
            page,
            totalDocs,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage: hasPrevPage ? prevPage : null,
            nextPage: hasNextPage ? nextPage : null,
            prevLink: hasPrevPage ? prevUrl : null,
            nextLink: hasNextPage ? nextUrl : null
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