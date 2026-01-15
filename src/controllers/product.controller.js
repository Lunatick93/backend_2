import * as service from "../services/product.service.js";
import { catchAsync } from "../middlewares/errorHandler.js";

export const getAll = catchAsync(async (req, res) => {
  const params = {
    limit: req.query.limit,
    page: req.query.page,
    sort: req.query.sort,
    query: req.query.query
  };
  const result = await service.queryProducts(params);
  res.json(result);
});

export const getById = catchAsync(async (req, res) => {
  const p = await service.getProduct(req.params.pid);
  res.json(p);
});

export const create = catchAsync(async (req, res) => {
  const newP = await service.createProduct(req.body);
  res.status(201).json(newP);
});

export const update = catchAsync(async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ error: "No hay campos para actualizar" });
  }
  const updated = await service.updateProduct(req.params.pid, req.body);
  res.json(updated);
});

export const remove = catchAsync(async (req, res) => {
  await service.deleteProduct(req.params.pid);
  res.json({ message: "Producto eliminado" });
});
