import mongoose from "mongoose";

const carritoSchema = new mongoose.Schema({
    productos: {type: Array}
})

export const Carrito = mongoose.model('Carrito', carritoSchema, "Carritos")