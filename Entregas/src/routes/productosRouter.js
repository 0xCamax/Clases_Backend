import { Router } from "express";
import { productManager } from "../main.js";



export const router = Router()


router.get("/", async (req, res) => {
    let {limit} = req.query
    let showProducts = await productManager.getProducts()
    if (limit) {
        let show = showProducts.slice(0, limit)
        return res.json(show)
    } else {
        return res.status(200).send(showProducts)
    }

})

router.get("/:pid", async (req, res) => {
    let { pid } = req.params
    pid = Number(pid)
    if (isNaN(pid)) {
        return res.send(`Error: pid debe ser un numero`)
    } else {
        try {
            let producto = await productManager.getPid(pid)
            if(!producto){
                return res.send(`No existe producto con id: ${pid}`)
            } else {
                return res.json(producto)
            }
        } catch (error) {
            return res.json(error)
        }
    }
})

router.post("/", async (req, res) => {
    try {
        let {titulo, descripcion, categoria, precio, imagen, codigo, stock} = req.body
        let lista = await productManager.getProducts()
        let repetido = lista.some((p) => p.codigo == codigo)
        let invalidProp = Object.keys(req.body).filter(v => !productManager.validProps.includes(v))
        let invalidStr = [titulo, descripcion, categoria, codigo].some(prop => typeof prop !== "string")
        let invalidNum = [precio, stock].some(num => typeof num !== "number")
        let invalidImg = imagen.some(img => typeof img !== "string")

        if (invalidProp.length >= 1){
            throw new Error(`Propiedad invalida: ${invalidProp.join(", ")}`)
        }else if(repetido){
            throw new Error(`${codigo} repetido`)
        } else if (invalidNum || invalidStr || invalidImg) {
            throw TypeError
        } else {
            let newProduct = await productManager.add(req.body)
            res.setHeader("Content-Type", "aplication/json")
            return res.status(201).json(newProduct)
        }
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

        let invalidProp = Object.keys(req.body).filter(v => !productManager.validProps.includes(v))
        console.log(invalidProp)

        if (invalidProp.length >= 1){
            throw new Error(`Propiedad invalida: ${invalidProp.join(", ")}`)
        } else {
            let update = await productManager.update(pid, req.body)
            res.setHeader("Content-Type", "aplication/json")
            return res.status(200).json(update)
        }
    
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
        
        if (typeof eliminar == "string"){
            res.setHeader("Content-Type", "aplication/json")
            return res.status(404).json({
                error: `${eliminar}`,
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