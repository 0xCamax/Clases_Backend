import { Router } from "express";
import { productManager } from "../main.js";



export const router = Router()


router.get("/", async (req, res) => {
    try {
        let {limit} = req.query
        let showProducts = await productManager.getProducts()
        if (limit) {
            let show = showProducts.slice(0, limit)
            return res.json(show)
        } else {
            return res.status(200).send(showProducts)
        }
    } catch (error) {
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            error: "Error al mostrar productos",
            detalle: `${error.message}`
        })
    }

})

router.get("/:pid", async (req, res) => {
    try {
        let { pid } = req.params
        let producto = await productManager.getPid(pid)
        if(!producto){
            return res.send(`No existe producto con id: ${pid}`)
        } else {
            return res.json(producto)
        }
        } catch (error) {
            res.setHeader("Content-Type", "aplication/json")
            return res.status(500).json({
                error: "Error al buscar producto",
                detalle: `${error.message}`
            })
        }
    }
)

router.post("/", async (req, res) => {
    try {
        let newProduct = await productManager.add(req.body)
        res.setHeader("Content-Type", "aplication/json")
        return res.status(201).json(newProduct)
    } catch (error) {
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            error: "Error al agregar producto",
            detalle: `${error.message}`
        })
    }
})

router.put("/:pid", async (req, res) => {
    try {
        let { pid } = req.params

        let update = await productManager.update(pid, req.body)

        res.setHeader("Content-Type", "aplication/json")
        return res.status(200).json({
            detalle: "Producto modificado",
            antes: update.update,
            modificacion: update.updateProd
        })

    } catch (error) {
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            error: "Error al actualizar producto",
            detalle: `${error.message}`
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
                error: `No existe id: ${pid}`,
            })
        } else {
            res.setHeader("Content-Type", "aplication/json")
            return res.status(200).json({
                producto: `codigo: ${eliminar.codigo}`,
                status: "eliminado"
            })
        }
    } catch (error) {
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            error: "Error al eliminar producto",
            detalle: `${error.message}`
        })
    }

})