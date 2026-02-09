import { Router } from "express";
import * as ctrl from "../controllers/product.controller.js";
import { getCurrent } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

// Cualquier usuario puede ver productos
router.get("/", ctrl.getAll);
router.get("/:pid", ctrl.getById);

// Solo ADMIN: crear, actualizar, eliminar productos
router.post("/", getCurrent, requireAdmin, ctrl.create);
router.put("/:pid", getCurrent, requireAdmin, ctrl.update);
router.delete("/:pid", getCurrent, requireAdmin, ctrl.remove);

export default router;
