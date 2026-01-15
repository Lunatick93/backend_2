import * as service from "../services/cart.service.js";
import { catchAsync } from "../middlewares/errorHandler.js";

export const create = catchAsync(async (req, res) => {
  const cart = await service.createCart();
  res.status(201).json(cart);
});

export const addProduct = catchAsync(async (req, res) => {
  const updatedCart = await service.addProductToCart(
    req.params.cid,
    req.params.pid
  );
  res.json(updatedCart.products);
});

export const getById = catchAsync(async (req, res) => {
  const cart = await service.getCartById(req.params.cid);
  res.json(cart.products);
});

export const deleteProduct = catchAsync(async (req, res) => {
  const updated = await service.deleteProductFromCart(
    req.params.cid,
    req.params.pid
  );
  res.json(updated.products);
});

export const updateCart = catchAsync(async (req, res) => {
  const updated = await service.updateCartProducts(
    req.params.cid,
    req.body.products
  );
  res.json(updated.products);
});

export const updateQuantity = catchAsync(async (req, res) => {
  const updated = await service.updateProductQuantity(
    req.params.cid,
    req.params.pid,
    req.body.quantity
  );
  res.json(updated.products);
});

export const clear = catchAsync(async (req, res) => {
  await service.clearCart(req.params.cid);
  res.json({ message: "Carrito vaciado" });
});
