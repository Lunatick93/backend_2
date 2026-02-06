import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";
import { userToDTO } from "../dtos/user.dto.js";
import Cart from "../models/cart.model.js";
import { catchAsync } from "../middlewares/errorHandler.js";


export const register = catchAsync(async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  if (!first_name || !last_name || !email || !age || !password) {
    return res.status(400).json({
      error: "Todos los campos son obligatorios (first_name, last_name, email, age, password)"
    });
  }

  if (typeof age !== "number" || age < 1) {
    return res.status(400).json({ error: "La edad debe ser un número mayor a 0" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ error: "El email ya está registrado" });
  }

  const cart = await Cart.create({ products: [] });

  const newUser = new User({
    first_name,
    last_name,
    email: email.toLowerCase(),
    age,
    password, 
    cart: cart._id
  });

  await newUser.save();

  const token = generateToken(newUser);

  res.status(201).json({
    message: "Usuario registrado exitosamente",
    token,
    user: userToDTO(newUser)
  });
});


export const login = catchAsync(async (req, res) => {

  const token = generateToken(req.user);

  res.json({
    message: "Login exitoso",
    token,
    user: userToDTO(req.user) 
  });
});

export const current = catchAsync(async (req, res) => {
  const userDTO = userToDTO(req.user);

  res.json({
    status: "success",
    message: "Usuario autenticado correctamente",
    user: userDTO
  });
});

export const logout = catchAsync(async (req, res) => {
  res.json({ message: "Logout exitoso" });
});
