import { Schema, model, Types } from "mongoose";
import bcrypt from "bcrypt";

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
    ,
    // campos para recuperacion de contraseña
    resetPasswordToken: {
      type: String,
      select: false
    },
    resetPasswordExpires: {
      type: Date,
      select: false
    }
  },
  { timestamps: true }
);


userSchema.pre("save", function (next) {
  // si es que la contraseña no fue modificada, avanza sin encriptar
  if (!this.isModified("password")) {
    return next();
  }

  this.password = bcrypt.hashSync(this.password, 10);
  next();
});


userSchema.methods.comparePassword = function (passwordIngresada) {
  return bcrypt.compareSync(passwordIngresada, this.password);
};


userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;  // elimina la contraseña antes de devolver
  return obj;
};

export default model("User", userSchema);
