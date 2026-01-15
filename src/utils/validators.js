
export const productValidators = {
  /**
   * valida que un producto tenga los campos obligatorios
   * @param {Object} data - dtos del producto
   * @throws {Error} sifalta un campo obligatorio
   */
  validateRequired(data) {
    const required = ["title", "description", "code", "price", "stock", "category"];
    const missing = required.filter((field) => !data[field]);

    if (missing.length > 0) {
      throw new Error(`Campos obligatorios faltantes: ${missing.join(", ")}`);
    }
  },

  /**
   * valida que el precio sea un numero positivo
   * @param {number} price - Precio del producto
   * @throws {Error}si el precio no es valido
   */
  validatePrice(price) {
    if (typeof price !== "number" || price <= 0) {
      throw new Error("El precio debe ser un número positivo");
    }
  },

  /**
   * valida que el stock sea un numero no negativo
   * @param {number} stock -stock del producto
   * @throws {Error}si el stock no es valido
   */
  validateStock(stock) {
    if (typeof stock !== "number" || stock < 0 || !Number.isInteger(stock)) {
      throw new Error("El stock debe ser un número entero no negativo");
    }
  },

  /**
   * valida que el codigo sea unico y valido
   * @param {string} code -codigodel producto
   * @throws {Error}si el código no es valido
   */
  validateCode(code) {
    if (!code || typeof code !== "string" || code.trim().length === 0) {
      throw new Error("El código debe ser una cadena no vacía");
    }
    if (code.length > 50) {
      throw new Error("El código no puede exceder 50 caracteres");
    }
  },

  /**
   * valida que el titulo tenga longitud valida
   * @param {string} title - titulo del producto
   * @throws {Error} si el título no es valido
   */
  validateTitle(title) {
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      throw new Error("El título debe ser una cadena no vacía");
    }
    if (title.length < 3 || title.length > 100) {
      throw new Error("El título debe tener entre 3 y 100 caracteres");
    }
  },

  /**
   * valida que la descripción tenga longitud valida
   * @param {string} description - descripcion del producto
   * @throws {Error} si la descripción no es valida
   */
  validateDescription(description) {
    if (!description || typeof description !== "string" || description.trim().length === 0) {
      throw new Error("La descripción debe ser una cadena no vacía");
    }
    if (description.length < 10 || description.length > 500) {
      throw new Error("La descripción debe tener entre 10 y 500 caracteres");
    }
  },

  /**
   *valida que la categoria sea valida
   * @param {string} category - categoria del producto
   * @throws {Error} si la categoria no es valida
   */
  validateCategory(category) {
    if (!category || typeof category !== "string" || category.trim().length === 0) {
      throw new Error("La categoría debe ser una cadena no vacía");
    }
  },

  /**
   * valida el id de mongo
   * @param {string} id -id  validar
   * @throws {Error} si el id no es valido
   */
  validateMongoId(id) {
    if (!id || typeof id !== "string" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new Error("ID de MongoDB inválido");
    }
  }
};

export const cartValidators = {
  /**
   * valida que la cantidad sea valida
   * @param {number} quantity - cantidad a validar
   * @throws {Error} si la cantidad no es válida
   */
  validateQuantity(quantity) {
    if (typeof quantity !== "number" || quantity <= 0 || !Number.isInteger(quantity)) {
      throw new Error("La cantidad debe ser un número entero positivo");
    }
  },

  /**
   * valida que el array de productos sea valido
   * @param {Array} products - array de productos
   * @throws {Error} si el array no es valido
   */
  validateProductsArray(products) {
    if (!Array.isArray(products)) {
      throw new Error("Los productos deben ser un array");
    }
    if (products.length === 0) {
      throw new Error("El array de productos no puede estar vacío");
    }
    products.forEach((item, index) => {
      if (!item.product || typeof item.product !== "string") {
        throw new Error(`Producto ${index}: ID de producto inválido`);
      }
      if (typeof item.quantity !== "number" || item.quantity <= 0) {
        throw new Error(`Producto ${index}: Cantidad inválida`);
      }
    });
  }
};
