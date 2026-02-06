import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";
import { userToDTO } from "../dtos/user.dto.js";
import Cart from "../models/cart.model.js";
import { catchAsync } from "../middlewares/errorHandler.js";
import crypto from "crypto";
import { sendResetEmail, sendResetSMS } from "../utils/mailer.js";


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


// solicita un correo para recuperar contraseña
export const requestPasswordReset = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "El email es obligatorio" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });


  if (!user) {
    return res.json({ message: "Si el email existe, se ha enviado un correo para restablecer la contraseña" });
  }

  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hora

  await user.save();

  await sendResetEmail(user.email, token);

  return res.json({ message: "Si el email existe, se ha enviado un correo para restablecer la contraseña" });
});


// restablece la contraseña usando token
export const resetPassword = catchAsync(async (req, res) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({ error: "email, token y newPassword son obligatorios" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  }).select("+password +resetPasswordToken +resetPasswordExpires");

  if (!user) {
    return res.status(400).json({ error: "Token inválido o expirado" });
  }

  // evita que la nueva contraseña sea igual a la anterior
  if (user.comparePassword(newPassword)) {
    return res.status(400).json({ error: "La nueva contraseña no puede ser igual a la anterior" });
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  const jwt = generateToken(user);

  res.json({ message: "Contraseña restablecida correctamente", token: jwt, user: userToDTO(user) });
});


// solicita un sms para recuperar contraseña (alternativa al email)
export const requestPasswordResetSMS = catchAsync(async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email || !phoneNumber) {
    return res.status(400).json({ error: "El email y número de teléfono son obligatorios" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.json({ message: "Si el email existe, se ha enviado un SMS para restablecer la contraseña" });
  }

  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hora

  await user.save();

  try {
    await sendResetSMS(phoneNumber, token);
  } catch (error) {
    return res.status(500).json({ error: "Error al enviar SMS: " + error.message });
  }

  return res.json({ message: "Si el email existe, se ha enviado un SMS para restablecer la contraseña" });
});