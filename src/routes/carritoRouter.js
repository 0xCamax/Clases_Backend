import { Router } from "express";
import passport from "passport";
import { add_product, create_cart, empty_cart, get_cart, update_cart } from "../controller/carritoController.js";


export const router = Router()

router.post("/", create_cart)
router.get("/:cid", get_cart)
router.post("/:cid/producto/:pid", passport.authenticate('jwt', {session: false}), add_product)
router.put("/:cid/producto/:pid", passport.authenticate('jwt', {session: false}), update_cart)
router.delete('/:cid', passport.authenticate('jwt', {session: false}), empty_cart)