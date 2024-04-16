import { Router } from "express";
import { productManager } from "./productosRouter.js";
import { CarritoManager } from "../dao/CarritoManager.js"
import path from "path"

export const router = Router()

export const carritoManager = new CarritoManager(path.resolve("src","datos", "carritos.json"))

router.post("/", async (req, res) => {
    try {
        let carrito = await carritoManager.add()
    
        res.setHeader("Content-Type", "aplication/json")
        return res.status(200).json({
            respuesta: "Carrito creado exitosamente",
            detalle: carrito
        })
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
        console.log(error)
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            error: "Error al buscar carrito"
        })
    }
})

router.post("/:cid/producto/:pid", async (req, res) => {
    try {
        let { cid, pid } = req.params
        let { cantidad } = req.body
        
        if (!cantidad || isNaN(Number(cantidad)) || Object.keys(req.body).length !== 1) {
            throw new Error ("Input invalido")
        } else {
            let producto = await productManager.getPid(pid)
            if(!producto) {
                res.setHeader("Content-Type", "aplication/json")
                return res.status(500).json({
                    error: "Error al agregar producto al carrito",
                    detalle: `No existe pid: ${pid}`
                })
            } else {
                let carrito = await carritoManager.add(cid, producto.id, cantidad)
                
                res.setHeader("Content-Type", "aplication/json")
                return res.status(200).json({
                    respuesta: "Producto agregado",
                    detalle: {
                        pid: producto.id,
                        cantidad: cantidad,
                        carrito: carrito
                    }   
                })
            }
        }
    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            error: "Error al agregar producto al carrito"
        })
    }
})

router.delete("/:cid/producto/:pid", async (req, res) => {
    try {
        let { cid, pid } = req.params
        let { cantidad } = req.body
        
        if (!cantidad || isNaN(Number(cantidad)) || Object.keys(req.body).length !== 1) {
            throw new Error ("Input invalido")
        } else {
            let producto = await productManager.getPid(pid)
            if(!producto) {
                res.setHeader("Content-Type", "aplication/json")
                return res.status(500).json({
                    error: "Error al eliminar producto del carrito",
                    detalle: `No existe pid: ${pid}`
                })
            } else {    
                let carrito = await carritoManager.deletePid(cid, producto.id, cantidad)
                res.setHeader("Content-Type", "aplication/json")
                return res.status(200).json({
                    respuesta: "Producto eliminado",
                    detalle: {
                        pid: producto.id,
                        cantidad: cantidad,
                        carrito: carrito
                    }   
                })
            }
        }
    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            error: "Error al eliminar producto del carrito"
        })
    }
})