import { Router } from "express";
import { ProductManager } from "../dao/ProductManager.js"
import { io } from "../main.js";


export const router = Router()

export const productManager = new ProductManager()


router.get("/", async (req, res) => {
    try {
        let {limit, page, sort, query} = req.query
        limit ? limit : limit = 5
        page ? page : page = 1
        let url = `http://localhost:8080/api/producto?limit=${limit}`
        let showProducts = await productManager.getProducts()
        if (query) {
            showProducts = showProducts.filter(q => q.categoria === query)
            url = url + `&query=${query}`
        }
        let show = showProducts.slice((page-1)*limit, limit*page)
        if (sort === 'desc') {
            show.sort((a,b) => a.precio - b.precio)
            url = url + `&sort=${sort}`
        }
        if (sort === 'asc') {
            show.sort((a,b) => b.precio - a.precio)
            url = url + `&sort=${sort}`
        }

        let totalPages = Math.ceil(showProducts.length/limit)
        let hasNextPage = page < totalPages
        let hasPrevPage = page > 1
        let prevPage = Number(page) - 1
        let nextPage = Number(page) + 1
        let prevUrl = hasPrevPage ? url + `&page=${prevPage}`: null
        let nextUrl = hasNextPage ? url + `&page=${nextPage}`: null

        res.setHeader("Content-Type", "aplication/json")
        return res.json({
            status: 'success',
            payload: show,
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