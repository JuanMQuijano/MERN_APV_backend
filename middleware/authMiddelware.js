//Creamos un middleware para valdiar si el usuario está autenticado o no
import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {
  //Variable vacia
  let token;

  //Validamos si el usuario está enviando el token y si el token empiza con Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Eliminamos el Bearer del string
      token = req.headers.authorization.split(" ")[1];

      //Verifica que el token coincida -> Si coincide extrae la información almacenada en el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Agregamos al req el objeto de veterinario que obtenemos en la consultas
      req.veterinario = await Veterinario.findById(decoded.id).select(
        "-password -token -confirmado" //Evita traer de la base de datos estos atributos
      );

      //Despues ejecuta la siguiente función
      return next();
    } catch (error) {
      const e = new Error("Token No Válido");
      res.status(403).json({ msg: e.message });
    }
  }

  //Si no encuentra el token imprime el mensaje
  if (!token) {
    const error = new Error("Token No Válido o Inexistente");
    return res.status(403).json({ msg: error.message });
  }
};

export default checkAuth;
