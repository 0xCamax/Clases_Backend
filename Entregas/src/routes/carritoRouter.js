import { Router } from "express";
import { carritoManager, productManager } from "../main.js";

export const router = Router()

router.post("/", async (req, res) => {
    try {
        let carrito = await carritoManager.add()
    
        res.setHeader("Content-Type", "aplication/json")
        return res.status(200).json(carrito)
    } catch (error) {
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            error: "Error al crear carrito",
            detalle: `${error.message}`
        })
    }
})

router.get("/:cid", async (req, res) => {
    try {
        let { cid } = req.params

    
        let carrito = await carritoManager.getCid(cid)
        if (!carrito){
            throw new Error("No existe")
        } else {
            res.setHeader("Content-Type", "aplication/json")
            return res.status(200).json(carrito)
        }
    } catch (error) {
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            error: "Error al buscar carrito",
            detalle: `${error.message}`
        })
    }
})

router.post("/:cid/producto/:pid", async (req, res) => {
    try {
        let { cid, pid } = req.params
        let { cantidad } = req.body

        let producto = await productManager.getPid(pid)
        let carrito = await carritoManager.add(cid, producto.id, cantidad)
    
        res.setHeader("Content-Type", "aplication/json")
        return res.status(200).json({
            detalle: carrito
        })
    } catch (error) {
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            error: "Error al agregar producto al carrito",
            detalle: `${error.message}`
        })
    }
})