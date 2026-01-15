import Product from "../models/product.model.js";
import { productValidators } from "../utils/validators.js";

export async function queryProducts({ limit = 10, page = 1, sort, query }) {
  const filter = {};
  if (query) {
    if (query === "available") filter.status = true;
    else filter.category = query;
  }

  const options = {
    page: Number(page),
    limit: Number(limit),
    lean: true
  };
  if (sort === "asc") options.sort = { price: 1 };
  if (sort === "desc") options.sort = { price: -1 };

  const result = await Product.paginate(filter, options);

  return {
    status: "success",
    payload: result.docs,
    totalPages: result.totalPages,
    prevPage: result.hasPrevPage ? result.prevPage : null,
    nextPage: result.hasNextPage ? result.nextPage : null,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage
      ? `?limit=${limit}&page=${result.prevPage}&sort=${sort || ""}&query=${query || ""}`
      : null,
    nextLink: result.hasNextPage
      ? `?limit=${limit}&page=${result.nextPage}&sort=${sort || ""}&query=${query || ""}`
      : null
  };
}

export async function getProduct(id) {
  productValidators.validateMongoId(id);
  const p = await Product.findById(id).lean();
  if (!p) throw new Error("Producto no encontrado");
  return p;
}

export async function createProduct(data) {
  productValidators.validateRequired(data);
  productValidators.validateTitle(data.title);
  productValidators.validateDescription(data.description);
  productValidators.validateCode(data.code);
  productValidators.validatePrice(data.price);
  productValidators.validateStock(data.stock);
  productValidators.validateCategory(data.category);

  const existingProduct = await Product.findOne({ code: data.code });
  if (existingProduct) {
    throw new Error("El código del producto ya existe");
  }

  const newProd = new Product(data);
  return await newProd.save();
}

export async function updateProduct(id, data) {
  productValidators.validateMongoId(id);

  if (data.id) throw new Error("No se puede modificar el campo id");
  if (data.title) productValidators.validateTitle(data.title);
  if (data.description) productValidators.validateDescription(data.description);
  if (data.price) productValidators.validatePrice(data.price);
  if (data.stock) productValidators.validateStock(data.stock);
  if (data.category) productValidators.validateCategory(data.category);
  if (data.code) {
    productValidators.validateCode(data.code);
    const existingProduct = await Product.findOne({ code: data.code, _id: { $ne: id } });
    if (existingProduct) {
      throw new Error("El código del producto ya existe");
    }
  }

  const updated = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  }).lean();

  if (!updated) throw new Error("Producto no encontrado");
  return updated;
}

export async function deleteProduct(id) {
  productValidators.validateMongoId(id);
  const deleted = await Product.findByIdAndDelete(id).lean();
  if (!deleted) throw new Error("Producto no encontrado");
  return deleted !== null;
}
