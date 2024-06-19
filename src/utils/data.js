import { Product } from "../models/productsModel.js";

// generar data falsa para pruebas

const { random, floor } = Math

const categorias = ["MEME", "FINANCE", "DEFI", "GAMING", "AI", "ETHEREUM ECOSYSTEM", "SOLANA ECOSYSTEM", "TRON ECOSYSTEM", "SPORTS", "DAO", "ARBITRUM ECOSYSTEM", "GAMBLING", "ART", "PREDICTION MARKET", "LIQUID STAKING" ]
const titulos = [
    {
        titulo: "ERC-20",
        descripcion: "Token Standard"
    },
    {
        titulo: "ERC-223",
        descripcion: "Token with transaction handling model"
    },
    {
        titulo: "ERC-721",
        descripcion: "Non-Fungible Token Standard"
    },
    {
        titulo: "ERC-777",
        descripcion: "Token Standard"
    },
    {
        titulo: "ERC-1155",
        descripcion: "Multi Token Standard"
    },
    {
        titulo: "ERC-1363",
        descripcion: "Payable Token"
    },
    {
        titulo: "ERC-3525",
        descripcion: "Semi-Fungible Token"
    },
    {
        titulo: "ERC-4626",
        descripcion: "Tokenized Vaults"
    },
    {
        titulo: "ERC-5507",
        descripcion: "Refundable Tokens"
    },
    {
        titulo: "ERC-5528",
        descripcion: "Refundable Fungible Token"
    },
    {
        titulo: "ERC-6809",
        descripcion: "Non-Fungible Key Bound Token"
    },
    {
        titulo: "ERC-6982",
        descripcion: "Efficient Default Lockable Tokens"
    }
]



class Productos {

    #info
    #categorias
    #code

    constructor(info, categorias){
        this.#info = info
        this.#categorias = categorias
        this.#code = 0
    }

    async crearProductos (i) {
        for(i; i > 0; i--){
            let { titulo, descripcion } = this.#getInfo()
            let precio =  floor(random() * (5000 - 100 + 1)) + 100
            let codigo = this.#getCodigo()
            let stock = floor(random() * (420 - 69 + 1)) + 69
            let categoria = this.#getCategoria()
            let newProduct = new Product({
                titulo: titulo,
                descripcion: descripcion,
                categoria: categoria,
                precio: precio,
                imagen: ["na"],
                codigo: codigo,
                stock: stock
            })
            await newProduct.save()
        }
    }

    #getInfo(){
        let index = floor(random() * (this.#info.length))
        return this.#info[index]
    }
    #getCategoria(){
        let index = floor(random() * (this.#categorias.length))
        return this.#categorias[index]
    }

    #getCodigo(){
        let code = this.#code.toString(16).padStart(6, "0")
        this.#code++
        return code 
    }

    async isEmpty() {
        let docs = await Product.countDocuments()
        let empty = docs === 0
        return empty
    }

    async updateMany(filter, update) {
        return await Product.updateMany(filter, update)
    }
}

export const BD = new Productos(titulos, categorias)


