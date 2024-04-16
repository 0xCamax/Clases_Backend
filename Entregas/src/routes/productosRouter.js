import { Router } from "express";
import { ProductManager } from "../dao/ProductManager.js"
import path from "path"
import { io } from "../main.js";


export const router = Router()

export const productManager = new ProductManager(path.resolve("src","datos", "productos.json"))




router.get("/", async (req, res) => {
    try {
        let {limit} = req.query
        let showProducts = await productManager.getProducts()
        if (limit) {
            let show = showProducts.slice(0, limit)
            res.setHeader("Content-Type", "text/plain")
            return res.json(show)
    
        } else {
            res.setHeader("Content-Type", "text/plain")
            return res.status(200).json(showProducts)
        }

    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            error: "Error al mostrar productos"
        })
    }

})

router.get("/:pid", async (req, res) => {
    try {
        let { pid } = req.params
        let producto = await productManager.getPid(pid)
        if(!producto){
            return res.send({
                error: "Error al mostrar los productos",
                detalle: `No existe producto con id: ${pid}`
            })
        } else {
            res.setHeader("Content-Type", "text/plain")
            return res.status(200).json(producto)
        }
        } catch (error) {
            console.log(error)
            res.setHeader("Content-Type", "text/plain")
            return res.status(500).json({
                error: "Error al buscar producto"
            })
        }
    }
)

router.post("/", async (req, res) => {
    try {
        let newProduct = await productManager.add(req.body)
        io.emit("agregar", newProduct)
        res.setHeader("Content-Type", "text/plain")
        return res.status(200).json({
            respuesta: "Se agrego el producto exitosamente",
            detalle: newProduct
        })
    } catch (error) {
        res.setHeader("Content-Type", "text/plain")
        return res.status(500).json({
            error: "Error al agregar producto",
            detalle: error.message,
            body: req.body
        })
    }
})

router.put("/:pid", async (req, res) => {
    try {
        let { pid } = req.params

        let update = await productManager.update(pid, req.body)

        res.setHeader("Content-Type", "text/plain")
        return res.status(200).json({
            respuesta: "Producto modificado",
            antes: update.update,
            modificacion: req.body,
            despues: update.updateProd
        })

    } catch (error) {
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            error: "Error al actualizar producto",
            detalle: error.message
        })
    }
})

router.delete("/:pid", async (req, res)=> {
    try {
        let { pid } = req.params
        let eliminar = await productManager.delete(pid)

        
        if (!eliminar){
            res.setHeader("Content-Type", "aplication/json")
            return res.status(500).json({
                error: `Error al eliminar producto`,
                detalle: `No existe id: ${pid}`
            })
        } else {
            io.emit("eliminar", eliminar)
            res.setHeader("Content-Type", "aplication/json")
            return res.status(200).json({
                respuesta: `Producto eliminado`,
                detalle: eliminar
            })
        }
    } catch (error) {
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            error: "Error al eliminar producto",
            detalle: error.message
        })
    }
})