import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import https from "https";

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

// Cargar los certificados (reemplaza las rutas según tus archivos)
const privateKey = fs.readFileSync("private.key");
const certificate = fs.readFileSync("www_rubiseduction_shop.crt");

// Crear credenciales
const credentials = {
  key: privateKey,
  cert: certificate,
};

// Crear servidor HTTPS
const httpsServer = https.createServer(credentials, app);

const PORT = process.env.PORT || 4000;
httpsServer.listen(PORT, () => {
  console.log(`Servidor HTTPS escuchando en https://localhost:${PORT}`);
});
