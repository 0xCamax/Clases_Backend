import CarritoService from "../services/CarritoService.js"
import ProductService from "../services/ProductService.js"

export async function create_cart (req, res) {
    try {
        let carrito = await CarritoService.create()
    
        res.setHeader("Content-Type", "aplication/json")
        return res.status(200).json({
            respuesta: "Carrito creado exitosamente",
            detalle: carrito
        })
    } catch (err) {
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            error: "Error al crear carrito",
            detalle: err.message
        })
    }
}

export async function get_cart(req, res) {
    try {
        const { cid } = req.params

        const carrito = await CarritoService.getCid(cid)

        res.setHeader("Content-Type", "aplication/json")
        return res.status(200).json({
            status: 'success',
            payload: carrito
        })
    } catch (err) {
        console.log(err)
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            status: 'error',
            error: "Error al buscar carrito"

        })
    }
}

export async function add_product (req, res) {
    try {
        let { cid, pid } = req.params
        let { cantidad } = req.body
        
        if (!cantidad || isNaN(Number(cantidad)) || Object.keys(req.body).length !== 1) {
            throw new Error ("Input invalido")
        } else {
            let producto = await ProductService.getPid(pid)
            if(!producto) {
                res.setHeader("Content-Type", "aplication/json")
                return res.status(500).json({
                    error: "Error al agregar producto al carrito",
                    detalle: `No existe pid: ${pid}`
                })
            } else {
                let carrito = await CarritoService.add(cid, producto._id, cantidad)
                res.setHeader("Content-Type", "aplication/json")
                return res.status(200).json({
                    status: 'success',
                    payload: {
                        respuesta: "Producto agregado",
                        detalle: {
                            pid: producto.id,
                            cantidad: cantidad,
                            carrito: carrito
                        }
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
}

export async function update_cart(req, res) {
    try {
        let { cid, pid } = req.params
        let { cantidad } = req.body
        
        if (!cantidad || isNaN(Number(cantidad)) || Object.keys(req.body).length !== 1) {
            throw new Error ("Input invalido")
        } else {
            let producto = await ProductService.getPid(pid)
            if(!producto) {
                res.setHeader("Content-Type", "aplication/json")
                return res.status(500).json({
                    error: "Error al eliminar producto del carrito",
                    detalle: `No existe pid: ${pid}`
                })
            } else {    
                let carrito = await CarritoService.deletePid(cid, producto.id, cantidad)
                res.setHeader("Content-Type", "aplication/json")
                return res.status(200).json({
                    status: 'success',
                    payload:{
                        respuesta: "Producto eliminado",
                        detalle: {
                            pid: producto.id,
                            cantidad: cantidad,
                            carrito: carrito
                        }   
                    }
                })
            }
        }
    } catch (err) {
        console.log(err)
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            error: "Error al eliminar producto del carrito"
        })
    }
}

export async function empty_cart(req, res){
    try{
        let { cid } = req.params
        let deleteAll = await CarritoService.deleteAll(cid)
        res.setHeader("Content-Type", "aplication/json")
        return res.status(200).json({
            status: 'success',
            payload: {
                respuesta: 'Carrito vacio',
                detalle: deleteAll
            }
        })
    } catch (err){
        console.log(err)
        res.setHeader("Content-Type", "aplication/json")
        return res.status(500).json({
            error: "Error al eliminar productos del carrito"
        })
    }
}