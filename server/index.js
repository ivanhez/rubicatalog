import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// Rutas
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Endpoints
app.use("/api/login", authRoutes);
app.use("/api/productos", productRoutes);
app.use("/api/pedidos", orderRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto " + PORT);
});
