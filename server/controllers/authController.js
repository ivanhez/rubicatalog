export const login = (req, res) => {
  const { password } = req.body;

  // Contraseña fija (en un entorno real, se guarda en .env)
  const ADMIN_PASSWORD = "admin123";

  if (password === ADMIN_PASSWORD) {
    // Token de ejemplo (hardcodeado). En producción usar librería JWT.
    return res.json({ token: "token-de-ejemplo" });
  } else {
    return res.status(401).json({ message: "Contraseña incorrecta" });
  }
};
