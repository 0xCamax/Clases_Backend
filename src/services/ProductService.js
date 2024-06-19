import { ProductDAO } from "../dao/ProductDAO.js"

class ProductImpl extends ProductDAO {
}

export const productManager = new ProductImpl()