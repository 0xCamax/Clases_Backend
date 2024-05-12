import mongoose from "mongoose";



const carritoSchema = new mongoose.Schema({
    productos: {
        type: [
            {
                pid: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },
                cantidad: Number,
                _id: false
            }
    ]}
})

export const Carrito = mongoose.model('Carrito', carritoSchema, "Carritos")