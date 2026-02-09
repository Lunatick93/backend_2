import { Router } from "express";
import * as ctrl from "../controllers/cart.controller.js";
import { getCurrent } from "../middlewares/auth.middleware.js";
import { requireUser } from "../middlewares/authorization.middleware.js";

const router = Router();

// Cualquier usuario puede ver su carrito
router.get("/:cid", ctrl.getById);

// Solo USER: agregar productos al carrito
router.post("/:cid/product/:pid", getCurrent, requireUser, ctrl.addProduct);
router.delete("/:cid/products/:pid", getCurrent, requireUser, ctrl.deleteProduct);
router.put("/:cid", getCurrent, requireUser, ctrl.updateCart);
router.put("/:cid/products/:pid", getCurrent, requireUser, ctrl.updateQuantity);
router.delete("/:cid", getCurrent, requireUser, ctrl.clear);

export default router;
