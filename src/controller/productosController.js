import { productManager } from "../services/ProductService.js";
import { io } from "../main.js";

export async function get_all(req, res){
    try {
        let { sort } = req.query
        let searchParam = new URLSearchParams(req._parsedUrl.search)
        let api = req.protocol + '://' + req.get('host') + req.baseUrl

        if (sort === "asc") req.query.sort = {precio: 1}
        if (sort === "desc") req.query.sort = {precio: -1}

        let options = {}
        Object.entries(req.query).forEach(([k,v]) => {
            if(k === "query" || k === "limit" || k === "sort" || k === "page"){
                options[k] = v
                if(k === "sort"){
                    v === 1 ? searchParam.set(k, "asc") : searchParam.set(k, "desc")
                } else {
                    searchParam.set(k, v)
                }
            }
        })

        let productos = await productManager.paginate(options)
        let categorias = await productManager.distinct('categoria')
        let {docs, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, totalDocs, limit, page} = productos

        let prevLink = null
        let nextLink = null
        if(prevPage) {
            searchParam.has("page") ? searchParam.set("page", prevPage) : searchParam.append("page", prevPage)
            prevLink = api + '?' + searchParam.toString()
        }
        if(nextPage) {
            searchParam.has("page") ? searchParam.set("page", nextPage) : searchParam.append("page", nextPage)
            nextLink = api + '?' + searchParam.toString()
        }

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
            nextLink,
            prevLink
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
}
export async function get_pid(req, res){
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

export async function add_product(req, res){
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
}
export async function update_product(req, res){
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
}
export async function delete_product(req, res){
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
}