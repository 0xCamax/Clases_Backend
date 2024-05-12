import { Router } from "express";
import { ProductManager } from "../dao/ProductManager.js"
import { io } from "../main.js";


export const router = Router()

export const productManager = new ProductManager()


router.get("/", async (req, res) => {
    try {
        let {limit, sort, query} = req.query
        let url = `http://localhost:8080/producto`
        if (limit) url = url + `?limit=${limit}`
        if (query) url = url + `&query=${query}`
        if (sort) url + `&sort=${sort}`
        
        let {docs, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, totalDocs} = await productManager.paginate(req.query)

        
        let prevUrl = hasPrevPage ? url + `&page=${prevPage}`: null
        let nextUrl = hasNextPage ? url + `&page=${nextPage}`: null

        res.setHeader("Content-Type", "aplication/json")
        return res.json({
            status: 'success',
            payload: docs,
            totalDocs: totalDocs,
            totalPages: totalPages,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevPage: hasPrevPage ? prevPage : null,
            nextPage: hasNextPage ? nextPage : null,
            prevLink: prevUrl,
            nextLink: nextUrl
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