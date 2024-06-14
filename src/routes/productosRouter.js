import { Router } from "express"
import { add_product, delete_product, get_all, get_pid, update_product } from "../controller/productosController.js";

export const router = Router()

router.get("/", get_all)
router.get("/:pid", get_pid)
router.post("/", add_product)
router.put("/:pid", update_product)
router.delete("/:pid", delete_product)