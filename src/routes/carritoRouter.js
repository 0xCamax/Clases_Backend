import { Router } from "express";
import passport from "passport";
import { add_cart, add_product, delete_cart, get_cart, update_cart } from "../controller/carritoController.js";


export const router = Router()

router.post("/", add_cart)
router.get("/:cid", get_cart)
router.post("/:cid/producto/:pid", passport.authenticate('jwt', {session: false}), add_product)
router.put("/:cid/producto/:pid", passport.authenticate('jwt', {session: false}), update_cart)
router.delete('/:cid', passport.authenticate('jwt', {session: false}), delete_cart)