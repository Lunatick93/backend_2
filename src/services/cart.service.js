import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { cartValidators, productValidators } from "../utils/validators.js";

export async function createCart() {
  const cart = await Cart.create({ products: [] });
  return cart.toObject();
}

export async function addProductToCart(cid, pid) {
  productValidators.validateMongoId(cid);
  productValidators.validateMongoId(pid);

  const cart = await Cart.findById(cid);
  if (!cart) throw new Error("Carrito no encontrado");

  const prod = await Product.findById(pid);
  if (!prod) throw new Error("Producto no encontrado");

  // Validar que hay stock disponible
  if (prod.stock <= 0) {
    throw new Error("Producto sin stock disponible");
  }

  const item = cart.products.find((p) => p.product.toString() === pid);
  if (item) {
    // Validar que no exceda el stock disponible
    if (item.quantity >= prod.stock) {
      throw new Error(`Solo hay ${prod.stock} unidades disponibles`);
    }
    item.quantity++;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  await cart.save();
  const populatedCart = await cart.populate("products.product");
  return populatedCart.toObject();
}

export async function getCartById(id) {
  productValidators.validateMongoId(id);
  const cart = await Cart.findById(id).populate("products.product");
  if (!cart) throw new Error("Carrito no encontrado");
  return cart.toObject();
}

export async function deleteProductFromCart(cid, pid) {
  productValidators.validateMongoId(cid);
  productValidators.validateMongoId(pid);

  const cart = await Cart.findById(cid);
  if (!cart) throw new Error("Carrito no encontrado");

  const itemExists = cart.products.some((p) => p.product.toString() === pid);
  if (!itemExists) throw new Error("Producto no encontrado en carrito");

  cart.products = cart.products.filter((p) => p.product.toString() !== pid);
  await cart.save();
  const populatedCart = await cart.populate("products.product");
  return populatedCart.toObject();
}

export async function updateCartProducts(cid, productsArray) {
  productValidators.validateMongoId(cid);
  cartValidators.validateProductsArray(productsArray);

  const cart = await Cart.findById(cid);
  if (!cart) throw new Error("Carrito no encontrado");

  // Validar que todos los productos existan
  for (const item of productsArray) {
    const prod = await Product.findById(item.product);
    if (!prod) throw new Error(`Producto ${item.product} no encontrado`);
  }

  cart.products = productsArray;
  await cart.save();
  const populatedCart = await cart.populate("products.product");
  return populatedCart.toObject();
}

export async function updateProductQuantity(cid, pid, qty) {
  productValidators.validateMongoId(cid);
  productValidators.validateMongoId(pid);
  cartValidators.validateQuantity(qty);

  const cart = await Cart.findById(cid);
  if (!cart) throw new Error("Carrito no encontrado");

  const prod = await Product.findById(pid);
  if (!prod) throw new Error("Producto no encontrado");

  // Validar que la cantidad no exceda el stock
  if (qty > prod.stock) {
    throw new Error(`Solo hay ${prod.stock} unidades disponibles`);
  }

  const item = cart.products.find((p) => p.product.toString() === pid);
  if (!item) throw new Error("Producto no encontrado en carrito");

  item.quantity = qty;
  await cart.save();
  const populatedCart = await cart.populate("products.product");
  return populatedCart.toObject();
}

export async function clearCart(cid) {
  productValidators.validateMongoId(cid);
  const cart = await Cart.findById(cid);
  if (!cart) throw new Error("Carrito no encontrado");
  cart.products = [];
  await cart.save();
  return cart.toObject();
}
