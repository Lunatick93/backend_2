import { Router } from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import mongoosePaginate from "mongoose-paginate-v2";
import { getCurrent } from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";
import { verifyToken } from "../utils/jwt.js";

const router = Router();

router.get("/auth-demo", async (req, res) => {
  try {
    let user = null;
    let userJSON = null;
    let error = null;

    // Si viene token en la query, úsalo
    if (req.query.token) {
      try {
        const decoded = verifyToken(req.query.token);
        user = await User.findById(decoded.id);
        if (!user) {
          error = "Usuario no encontrado en la base de datos";
        } else {
          userJSON = JSON.stringify(user.toObject(), null, 2);
        }
      } catch (err) {
        error = "Token inválido o expirado";
        console.error("Error verificando token:", err.message);
      }
    } else if (req.user) {
      // Si no hay token en query, usa el del request (si está autenticado)
      user = req.user;
      userJSON = JSON.stringify(user.toObject ? user.toObject() : user, null, 2);
    }

    res.render("authorizationDemo", {
      title: "Demo - Autorización por Rol",
      currentUser: user,
      userJSON: userJSON,
      error: error,
      helpers: {
        eq: (a, b) => a === b
      }
    });
  } catch (err) {
    console.error("Error en /auth-demo:", err);
    res.status(500).render("authorizationDemo", {
      title: "Demo - Autorización por Rol",
      currentUser: null,
      error: "Error interno del servidor: " + err.message
    });
  }
});

router.get("/products", async (req, res) => {
  const { limit, page, sort, query } = req.query;
  const result = await Product.paginate(query ? { category: query } : {}, {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {}
  });
  const pages = [];
  for (let i = 1; i <= result.totalPages; i++) {
    pages.push(i);
  }
  let cart = await Cart.findOne();
  if (!cart) cart = await Cart.create({ products: [] });

  res.render("index", {
    title: "Productos",
    products: result.docs,
    cartId: cart._id.toString(),
    pagination: {
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      baseLink: `/products?limit=${limit || 10}&sort=${sort || ""}&query=${query || ""}`
    },
    pages
  });
});

router.get("/products/:pid", async (req, res) => {
  const prod = await Product.findById(req.params.pid).lean();
  if (!prod) return res.status(404).send("Producto no encontrado");
  let cart = await Cart.findOne();
  if (!cart) cart = await Cart.create({ products: [] });
  res.render("productDetail", {
    title:   prod.title,
    product: prod,
    cartId:  cart._id.toString()
  });
});

router.get("/carts/:cid", async (req, res) => {
  const cart = await Cart.findById(req.params.cid)
    .populate("products.product")
    .lean();
  if (!cart) return res.status(404).send("Carrito no encontrado");
  res.render("cartDetail", {
  title: "Carrito",
  cartId:  req.params.cid,
  products: cart.products
});
});

export default router;
