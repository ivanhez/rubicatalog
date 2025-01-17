// db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  try {
    // Ajusta la URI con tus credenciales/dirección
    // Eliminamos la parte "ecommerce" en la URI, y usamos dbName en las opciones
    const uri = process.env.DB_URI;

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "ecommerce", // <-- ¡base de datos ecommerce!
    });

    console.log("Conectado a MongoDB correctamente (DB: ecommerce)");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};
