export const login = (req, res) => {
  const { password } = req.body;

  // Contraseña fija (en un entorno real, se guarda en .env)
  const ADMIN_PASSWORD = "Secreto123**";

  if (password === ADMIN_PASSWORD) {
    console.log(1);
    // Token de ejemplo (hardcodeado). En producción usar librería JWT.
    return res.json({ token: "token-de-ejemplo" });
  } else {
    console.log(2);
    return res.status(401).json({ message: "Contraseña incorrecta" });
  }
};
