import { Schema, model, Types } from "mongoose";
import bcrypt from "bcrypt";

/**
 * MODELO DE USUARIO
 * Contiene todos los campos requeridos por la consigna:
 * - first_name: Nombre del usuario
 * - last_name: Apellido del usuario
 * - email: Email único del usuario
 * - age: Edad del usuario
 * - password: Contraseña encriptada con bcrypt.hashSync
 * - cart: Referencia a un carrito de compras
 * - role: Rol del usuario (user o admin), por defecto 'user'
 */
const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "El nombre es obligatorio"]
    },
    last_name: {
      type: String,
      required: [true, "El apellido es obligatorio"]
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Por favor ingresa un email correcto"]
    },
    age: {
      type: Number,
      required: [true, "La edad es obligatoria"],
      min: [1, "La edad debe ser mayor a 0"]
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"]
    },
    cart: {
      type: Types.ObjectId,
      ref: "Cart"
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  { timestamps: true }
);

// MIDDLEWARE PRE-SAVE: Encripta la contraseña con bcrypt.hashSync antes de guardar
// Esto garantiza que la contraseña NUNCA se almacene en texto plano en la base de datos
userSchema.pre("save", function (next) {
  // Si la contraseña no fue modificada, continúa sin encriptar
  if (!this.isModified("password")) {
    return next();
  }

  // ENCRIPTACIÓN EXPLÍCITA CON bcrypt.hashSync:
  // - bcrypt.hashSync(password, salt) genera un hash seguro
  // - El segundo parámetro (10) es el factor de costo (rounds)
  // - Mayor número = más seguro pero más lento
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

// MÉTODO: Compara una contraseña ingresada con el hash almacenado
// Usa bcrypt.compareSync para validación segura
userSchema.methods.comparePassword = function (passwordIngresada) {
  return bcrypt.compareSync(passwordIngresada, this.password);
};

// MÉTODO: Excluye la contraseña de respuestas JSON
// Garantiza que la contraseña NUNCA se expone en las respuestas de la API
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;  // Elimina la contraseña antes de devolver
  return obj;
};

export default model("User", userSchema);
