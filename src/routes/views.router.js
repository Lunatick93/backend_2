import { Router } from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import mongoosePaginate from "mongoose-paginate-v2";

const router = Router();

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
