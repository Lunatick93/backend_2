/**
 * Validadores para productos y carritos
 */

export const productValidators = {
  /**
   * Valida que un producto tenga los campos obligatorios
   * @param {Object} data - Datos del producto
   * @throws {Error} Si falta un campo obligatorio
   */
  validateRequired(data) {
    const required = ["title", "description", "code", "price", "stock", "category"];
    const missing = required.filter((field) => !data[field]);

    if (missing.length > 0) {
      throw new Error(`Campos obligatorios faltantes: ${missing.join(", ")}`);
    }
  },

  /**
   * Valida que el precio sea un número positivo
   * @param {number} price - Precio del producto
   * @throws {Error} Si el precio no es válido
   */
  validatePrice(price) {
    if (typeof price !== "number" || price <= 0) {
      throw new Error("El precio debe ser un número positivo");
    }
  },

  /**
   * Valida que el stock sea un número no negativo
   * @param {number} stock - Stock del producto
   * @throws {Error} Si el stock no es válido
   */
  validateStock(stock) {
    if (typeof stock !== "number" || stock < 0 || !Number.isInteger(stock)) {
      throw new Error("El stock debe ser un número entero no negativo");
    }
  },

  /**
   * Valida que el código sea único y válido
   * @param {string} code - Código del producto
   * @throws {Error} Si el código no es válido
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
   * Valida que el título tenga longitud válida
   * @param {string} title - Título del producto
   * @throws {Error} Si el título no es válido
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
   * Valida que la descripción tenga longitud válida
   * @param {string} description - Descripción del producto
   * @throws {Error} Si la descripción no es válida
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
   * Valida que la categoría sea válida
   * @param {string} category - Categoría del producto
   * @throws {Error} Si la categoría no es válida
   */
  validateCategory(category) {
    if (!category || typeof category !== "string" || category.trim().length === 0) {
      throw new Error("La categoría debe ser una cadena no vacía");
    }
  },

  /**
   * Valida el ID de MongoDB
   * @param {string} id - ID a validar
   * @throws {Error} Si el ID no es válido
   */
  validateMongoId(id) {
    if (!id || typeof id !== "string" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new Error("ID de MongoDB inválido");
    }
  }
};

export const cartValidators = {
  /**
   * Valida que la cantidad sea válida
   * @param {number} quantity - Cantidad a validar
   * @throws {Error} Si la cantidad no es válida
   */
  validateQuantity(quantity) {
    if (typeof quantity !== "number" || quantity <= 0 || !Number.isInteger(quantity)) {
      throw new Error("La cantidad debe ser un número entero positivo");
    }
  },

  /**
   * Valida que el array de productos sea válido
   * @param {Array} products - Array de productos
   * @throws {Error} Si el array no es válido
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
