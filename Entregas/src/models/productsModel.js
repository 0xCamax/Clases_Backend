import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    titulo: { type: String, require: true}, 
    descripcion: {type: String, require: true}, 
    categoria: {type: String, require: true}, 
    precio: {type: Number, require: true}, 
    imagen: {type: [String], require: true}, 
    codigo: {type: String, require: true, unique: true, immutable: true}, 
    stock: {type: Number, require: true}, 
    status: {type: Boolean, default: true}
})

export const Product = mongoose.model('Product', productsSchema, "Productos")