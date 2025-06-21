import "dotenv/config";
import express from "express";
import { engine } from "express-handlebars";
import { connectDB } from "./config/db.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

async function startServer() {
  try {
    await connectDB();

    const app = express();
    const PORT = process.env.PORT || 8080;

    app.engine("handlebars", engine({
        layoutsDir: "src/views/layouts",
        defaultLayout: "main",
        runtimeOptions: {
          allowProtoPropertiesByDefault: true,
          allowProtoMethodsByDefault: true
        },
        helpers: {
        eq: (a, b) => a === b
        }
      })
    );
    app.set("view engine", "handlebars");
    app.set("views", "src/views");
    
    app.use(express.static("public"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.get("/", (req, res) => {res.redirect("/products");});
    app.use("/api/products", productsRouter);
    app.use("/api/carts", cartsRouter);
    app.use("/", viewsRouter);

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error arrancando el servidor:", err);
    process.exit(1);
  }
}

startServer();
